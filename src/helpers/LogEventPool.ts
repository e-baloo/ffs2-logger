/**
 * Object pool for LogEvent instances
 * Reduces garbage collection pressure by reusing objects
 */

import type { LogEvent } from '../types/LogEvent';
import type { LogLevel } from '../types/LogLevel';

export interface PoolableLogEvent extends LogEvent {
    /** Reset the object to its initial state */
    reset(): void;
    /** Mark object as returned to pool */
    _inPool?: boolean;
}

export class LogEventPool {
    private pool: PoolableLogEvent[] = [];
    private readonly maxPoolSize: number;
    private created = 0;
    private reused = 0;
    private active = 0;

    constructor(maxPoolSize = 100) {
        this.maxPoolSize = maxPoolSize;
    }

    /**
     * Get a LogEvent from the pool or create a new one
     */
    acquire(): PoolableLogEvent {
        let event = this.pool.pop();

        if (!event) {
            event = this.createNewEvent();
            this.created++;
        } else {
            this.reused++;
            event._inPool = false;
        }

        this.active++;
        return event;
    }

    /**
     * Return a LogEvent to the pool for reuse
     */
    release(event: PoolableLogEvent): void {
        if (event._inPool) {
            // Already in pool, ignore
            return;
        }

        // Reset the object state
        event.reset();
        event._inPool = true;

        // Add to pool if not full
        if (this.pool.length < this.maxPoolSize) {
            this.pool.push(event);
        }

        this.active = Math.max(0, this.active - 1);
    }

    /**
     * Create a new poolable LogEvent
     */
    private createNewEvent(): PoolableLogEvent {
        const event: PoolableLogEvent = {
            level: 'info',
            timestamp: 0,
            _inPool: false,

            reset(): void {
                delete this.message;
                delete this.data;
                delete this.context;
                delete this.error;
                this.level = 'info';
                this.timestamp = 0;
            },
        };

        return event;
    }

    /**
     * Convenient method to create and populate an event
     */
    createEvent(params: {
        level: LogLevel;
        message?: string;
        data?: unknown;
        context?: string;
        error?: Error;
        timestamp?: number;
    }): PoolableLogEvent {
        const event = this.acquire();

        event.level = params.level;
        if (params.message !== undefined) {
            event.message = params.message;
        }
        if (params.data !== undefined) {
            event.data = params.data;
        }
        if (params.context !== undefined) {
            event.context = params.context;
        }
        if (params.error !== undefined) {
            event.error = params.error;
        }
        event.timestamp = params.timestamp ?? Date.now();

        return event;
    }

    /**
     * Get pool statistics
     */
    getStats(): {
        poolSize: number;
        maxPoolSize: number;
        created: number;
        reused: number;
        active: number;
        hitRate: number;
    } {
        const total = this.created + this.reused;
        return {
            poolSize: this.pool.length,
            maxPoolSize: this.maxPoolSize,
            created: this.created,
            reused: this.reused,
            active: this.active,
            hitRate: total > 0 ? this.reused / total : 0,
        };
    }

    /**
     * Clear the pool and reset stats
     */
    clear(): void {
        this.pool.length = 0;
        this.created = 0;
        this.reused = 0;
        this.active = 0;
    }

    /**
     * Prewarm the pool with a certain number of objects
     */
    prewarm(count: number): void {
        for (let i = 0; i < Math.min(count, this.maxPoolSize); i++) {
            const event = this.createNewEvent();
            event.reset();
            event._inPool = true;
            this.pool.push(event);
        }
    }
}

// Default pool instance
export const logEventPool = new LogEventPool();
