import { clc } from '../helpers/cli-colors.util';
import { stringFormat } from '../helpers/stringFormat/stringFormat';
import type { ILoggerAppender } from '../interfaces/ILoggerAppender';
import type { ILoggerService } from '../interfaces/ILoggerService';
import type { LogEvent } from '../types/LogEvent';
import type { LogLevel } from '../types/LogLevel';

export class ConsoleAppender implements ILoggerAppender {
    private level: LogLevel = 'silly';

    constructor(private service: ILoggerService) {}

    getLogLevel(): LogLevel {
        return this.level;
    }

    setLogLevel(level: LogLevel): void {
        this.level = level;
    }

    private template = '{date} {level}{context}: {message}\n';

    async append(events: LogEvent | LogEvent[]): Promise<void> {
        if (!Array.isArray(events)) {
            events = [events];
        }

        events.forEach(event => {
            if (
                this.service.getLogLevelProvider() &&
                !this.service.getLogLevelProvider().isLogLevelEnabled(this.getLogLevel(), event.level)
            ) {
                return;
            }

            this.printMessages(event);
        });
    }

    initialize(): void {}

    destroy(): void {}

    isInitialized(): boolean {
        return true;
    }

    private readonly symbolIdentifier: symbol = Symbol.for('Appender:ConsoleAppender');

    getSymbolIdentifier(): symbol {
        return this.symbolIdentifier;
    }

    protected formatEvent(event: LogEvent) {
        return this.formattedTemplate({
            date: this.formatDate(event),
            level: this.formatLogLevel(event),
            context: this.formatContext(event),
            message: this.formatMessage(event),
        });
    }

    private formattedTemplate(data: { date: string; level: string; context: string; message: string }): string {
        return stringFormat(this.template, data);
    }

    protected formatLogLevel(event: LogEvent): string {
        return this.colorize(event.level.substring(0, 9).toUpperCase().padStart(9, ' '), event.level);
    }

    protected formatContext(event: LogEvent): string {
        const CONTEXT_LENGTH = 24;
        const context = (event.context ? event.context : '').substring(0, CONTEXT_LENGTH);
        return clc.context(`[${' '.repeat(CONTEXT_LENGTH - context.length)}${context}]`);
    }

    protected formatDate(event: LogEvent): string {
        return new Date(event.timestamp ?? Date.now()).toISOString();
    }

    protected formatMessage(event: LogEvent): string {
        return this.colorize(`${event.message}`.trim(), event.level);
    }

    protected printMessages(event: LogEvent, writeStreamType?: 'stdout' | 'stderr') {
        process[writeStreamType ?? 'stdout'].write(this.formatEvent(event));
        this.printData(event);
        this.printError(event);
    }

    private colorize(message: string, logLevel: LogLevel) {
        const color = this.getColorByLogLevel(logLevel);
        return color(message);
    }

    private printData(event: LogEvent): void {
        if (!event.data) {
            return;
        }
        process.stdout.write(this.colorize(`${JSON.stringify(event.data, null, 2)}\n`, 'data'));
    }

    private printError(event: LogEvent) {
        if (!event.error) {
            return;
        }

        const stack = event.error.stack;

        if (!stack) {
            return;
        }
        process.stderr.write(this.colorize(`${stack}\n`, 'error'));
    }

    private getColorByLogLevel(level: LogLevel) {
        switch (level) {
            case 'fatal':
                return clc.level.fatal;
            case 'error':
            case 'httpError':
                return clc.level.error;
            case 'warn':
                return clc.level.warn;
            case 'log':
            case 'info':
                return clc.level.info;
            case 'http':
                return clc.level.http;
            case 'data':
                return clc.level.data;
            case 'debug':
            case 'trace':
            case 'verbose':
            case 'silly':
                return clc.level.trace;

            default:
                return clc.level.trace;
        }
    }
}
