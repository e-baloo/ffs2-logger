/**
 * Async batch appender with configurable batching strategy
 * Groups log events and processes them in batches for better performance
 */

import { logEventPool, type PoolableLogEvent } from '../../helpers/LogEventPool';
import type { ILoggerAppender } from '../../interfaces/ILoggerAppender';
import type { LogEvent } from '../../types/LogEvent';
import type { LogLevel } from '../../types/LogLevel';

export interface BatchConfig {
    /** Maximum number of events in a batch */
    maxBatchSize: number;
    /** Maximum time to wait before flushing batch (ms) */
    maxWaitTime: number;
    /** Maximum memory usage before forcing flush (bytes) */
    maxMemoryUsage?: number;
    /** Enable retry on flush errors */
    enableRetry?: boolean;
    /** Maximum retry attempts */
    maxRetries?: number;
}

export interface BatchStats {
    totalEvents: number;
    batchesFlushed: number;
    avgBatchSize: number;
    pendingEvents: number;
    errors: number;
    retries: number;
}

export abstract class AAsyncBatchAppender implements ILoggerAppender {
    protected level: LogLevel = 'info';
    protected readonly symbolIdentifier: symbol;
    protected batch: LogEvent[] = [];
    protected flushTimer?: NodeJS.Timeout;
    protected stats: BatchStats;
    protected isDestroying = false;

    constructor(
        protected config: BatchConfig,
        name = 'AsyncBatchAppender'
    ) {
        this.symbolIdentifier = Symbol(`Appender:${name}`);
        this.stats = {
            totalEvents: 0,
            batchesFlushed: 0,
            avgBatchSize: 0,
            pendingEvents: 0,
            errors: 0,
            retries: 0,
        };

        // Ensure cleanup on process exit
        process.on('beforeExit', () => this.destroy());
        process.on('SIGINT', () => this.destroy());
        process.on('SIGTERM', () => this.destroy());
    }

    getSymbolIdentifier(): symbol {
        return this.symbolIdentifier;
    }

    getLogLevel(): LogLevel {
        return this.level;
    }

    setLogLevel(level: LogLevel): void {
        this.level = level;
    }

    isLogLevelEnabled(_targetLevel: LogLevel): boolean {
        // Simple implementation - should use proper level provider
        return true;
    }

    async initialize(): Promise<void> {
        // Override in subclasses if needed
    }

    async destroy(): Promise<void> {
        if (this.isDestroying) {
            return;
        }

        this.isDestroying = true;

        // Clear timer
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            delete this.flushTimer;
        }

        // Flush remaining events
        await this.flush();
    }

    isInitialized(): boolean {
        return !this.isDestroying;
    }

    /**
     * Append one or more log events
     */
    async append(message: LogEvent | LogEvent[]): Promise<void> {
        if (this.isDestroying) {
            return;
        }

        const events = Array.isArray(message) ? message : [message];

        for (const event of events) {
            await this.addToBatch(event);
        }
    }

    /**
     * Add event to batch and check flush conditions
     */
    protected async addToBatch(event: LogEvent): Promise<void> {
        this.batch.push(event);
        this.stats.totalEvents++;
        this.stats.pendingEvents++;

        // Check if we need to flush
        if (await this.shouldFlush()) {
            await this.flush();
        } else {
            this.scheduleFlush();
        }
    }

    /**
     * Check if batch should be flushed
     */
    protected async shouldFlush(): Promise<boolean> {
        // Size-based flush
        if (this.batch.length >= this.config.maxBatchSize) {
            return true;
        }

        // Memory-based flush
        if (this.config.maxMemoryUsage) {
            const memoryUsage = this.estimateBatchMemoryUsage();
            if (memoryUsage >= this.config.maxMemoryUsage) {
                return true;
            }
        }

        return false;
    }

    /**
     * Schedule a flush after maxWaitTime
     */
    protected scheduleFlush(): void {
        if (this.flushTimer || this.batch.length === 0) {
            return;
        }

        this.flushTimer = setTimeout(async () => {
            delete this.flushTimer;
            await this.flush();
        }, this.config.maxWaitTime);
    }

    /**
     * Flush the current batch
     */
    protected async flush(): Promise<void> {
        if (this.batch.length === 0) {
            return;
        }

        const batchToFlush = [...this.batch];
        this.batch = [];

        // Clear timer
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            delete this.flushTimer;
        }

        try {
            await this.processBatch(batchToFlush);
            this.stats.batchesFlushed++;
            this.stats.pendingEvents = Math.max(0, this.stats.pendingEvents - batchToFlush.length);
            this.updateAverageBatchSize(batchToFlush.length);

            // Return events to pool if they're poolable
            this.returnEventsToPool(batchToFlush);
        } catch (error) {
            this.stats.errors++;

            const maxRetries = this.config.maxRetries ?? 0;
            if (this.config.enableRetry && maxRetries > 0) {
                await this.retryBatch(batchToFlush, 0);
            } else {
                // Return events to pool even on error
                this.returnEventsToPool(batchToFlush);
                throw error;
            }
        }
    }

    /**
     * Retry failed batch with exponential backoff
     */
    protected async retryBatch(batch: LogEvent[], attempt: number): Promise<void> {
        const maxRetries = this.config.maxRetries ?? 3;
        if (attempt >= maxRetries) {
            this.returnEventsToPool(batch);
            throw new Error(`Failed to flush batch after ${attempt} retries`);
        }

        this.stats.retries++;
        const delay = Math.min(1000 * 2 ** attempt, 10000); // Max 10s delay

        await new Promise(resolve => setTimeout(resolve, delay));

        try {
            await this.processBatch(batch);
            this.stats.batchesFlushed++;
            this.updateAverageBatchSize(batch.length);
            this.returnEventsToPool(batch);
        } catch {
            await this.retryBatch(batch, attempt + 1);
        }
    }

    /**
     * Return poolable events back to pool
     */
    protected returnEventsToPool(events: LogEvent[]): void {
        for (const event of events) {
            if ('_inPool' in event && typeof event._inPool === 'boolean') {
                logEventPool.release(event as PoolableLogEvent);
            }
        }
    }

    /**
     * Update running average batch size
     */
    protected updateAverageBatchSize(batchSize: number): void {
        if (this.stats.batchesFlushed === 1) {
            this.stats.avgBatchSize = batchSize;
        } else {
            this.stats.avgBatchSize =
                (this.stats.avgBatchSize * (this.stats.batchesFlushed - 1) + batchSize) / this.stats.batchesFlushed;
        }
    }

    /**
     * Estimate memory usage of current batch
     */
    protected estimateBatchMemoryUsage(): number {
        let totalSize = 0;
        for (const event of this.batch) {
            totalSize += this.estimateEventSize(event);
        }
        return totalSize;
    }

    /**
     * Estimate memory usage of a single event
     */
    protected estimateEventSize(event: LogEvent): number {
        let size = 100; // Base object overhead

        if (event.message) {
            size += event.message.length * 2; // UTF-16
        }
        if (event.context) {
            size += event.context.length * 2;
        }
        if (event.data) {
            try {
                size += JSON.stringify(event.data).length * 2;
            } catch {
                size += 100; // Fallback for circular references
            }
        }

        return size;
    }

    /**
     * Get performance statistics
     */
    getStats(): BatchStats & { config: BatchConfig } {
        return {
            ...this.stats,
            config: { ...this.config },
        };
    }

    /**
     * Force flush current batch (useful for testing)
     */
    async forceFlush(): Promise<void> {
        await this.flush();
    }

    /**
     * Abstract method to process a batch of events
     * Subclasses must implement this to define how batches are processed
     */
    protected abstract processBatch(events: LogEvent[]): Promise<void>;
}
