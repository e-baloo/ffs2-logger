/**
 * Concrete implementation of AsyncBatchAppender for file output
 * Demonstrates batched file writing with retry logic
 */

import { writeFile, appendFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import type { LogEvent } from '../types/LogEvent';
import { AAsyncBatchAppender, type BatchConfig } from './base/AAsyncBatchAppender';

export interface FileAsyncBatchConfig extends BatchConfig {
    /** File path to write logs to */
    filePath: string;
    /** Whether to append to existing file or overwrite */
    append?: boolean;
    /** Date format for timestamp */
    timestampFormat?: string;
    /** Custom log format function */
    formatter?: (event: LogEvent) => string;
}

export class FileAsyncBatchAppender extends AAsyncBatchAppender {
    private readonly filePath: string;
    private readonly appendToFile: boolean;
    private readonly formatter: (event: LogEvent) => string;
    private fileInitialized = false;

    constructor(config: FileAsyncBatchConfig) {
        super(config, 'FileAsyncBatchAppender');
        this.filePath = path.resolve(config.filePath);
        this.appendToFile = config.append ?? true;
        this.formatter = config.formatter ?? this.defaultFormatter.bind(this);
    }

    async initialize(): Promise<void> {
        await super.initialize();

        // Ensure directory exists
        const dir = path.dirname(this.filePath);
        const { mkdir } = await import('node:fs/promises');
        await mkdir(dir, { recursive: true });

        // Create file if it doesn't exist (and we're not appending)
        if (!this.appendToFile) {
            await writeFile(this.filePath, '', 'utf8');
        } else {
            // Check if file exists, create if not
            try {
                await access(this.filePath, constants.F_OK);
            } catch {
                await writeFile(this.filePath, '', 'utf8');
            }
        }

        this.fileInitialized = true;
    }

    /**
     * Process batch by writing all events to file
     */
    protected async processBatch(events: LogEvent[]): Promise<void> {
        if (!this.fileInitialized) {
            await this.initialize();
        }

        const lines = events.map(event => this.formatter(event));
        const content = lines.join('\n') + '\n';

        try {
            await appendFile(this.filePath, content, 'utf8');
        } catch (error) {
            throw new Error(`Failed to write batch to file ${this.filePath}: ${error}`);
        }
    }

    /**
     * Default log formatter
     */
    private defaultFormatter(event: LogEvent): string {
        const timestamp = event.timestamp
            ? new Date(event.timestamp).toISOString()
            : new Date().toISOString();
        const level = event.level.toUpperCase().padStart(5);
        const context = event.context ? ` [${event.context}]` : '';

        let line = `${timestamp} ${level}${context}: ${event.message}`;

        if (event.data) {
            try {
                line += ` | ${JSON.stringify(event.data)}`;
            } catch {
                line += ' | [Circular Reference]';
            }
        }

        return line;
    }

    /**
     * Get file path
     */
    getFilePath(): string {
        return this.filePath;
    }
}

/**
 * Create a file batch appender with sensible defaults
 */
export function createFileAsyncBatchAppender(
    filePath: string,
    options: Partial<FileAsyncBatchConfig> = {}
): FileAsyncBatchAppender {
    const config: FileAsyncBatchConfig = {
        filePath,
        maxBatchSize: 100,
        maxWaitTime: 1000,
        maxMemoryUsage: 1024 * 1024, // 1MB
        enableRetry: true,
        maxRetries: 3,
        append: true,
        ...options,
    };

    return new FileAsyncBatchAppender(config);
}