// import { isLogLevelEnabled } from '../helpers/logLevel';
import type { ILogger } from '../interfaces/ILogger';
import type { ILoggerAppenders } from '../interfaces/ILoggerAppenders';
import type { ILoggerService } from '../interfaces/ILoggerService';
import type { LogEvent } from '../types/LogEvent';
import type { LogLevel } from '../types/LogLevel';
import type { LogMessage } from '../types/LogMessage';

export abstract class ALogger implements ILogger {
    private readonly symbolIdentifier: symbol;

    constructor(
        private readonly context: string,
        private readonly service: ILoggerService,
        private appenders: ILoggerAppenders,
        private logLevel: LogLevel = 'info'
    ) {
        this.symbolIdentifier = Symbol(`Logger:${context}`);
    }

    getAppenders(): ILoggerAppenders {
        return this.appenders;
    }

    getSymbolIdentifier(): symbol {
        return this.symbolIdentifier;
    }

    getContext(): string {
        return this.context;
    }

    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    getLogLevel(): LogLevel {
        return this.logLevel;
    }

    data(message: LogMessage): void {
        this._sendEvent(message, 'data');
    }
    error(message: LogMessage): void {
        this._sendEvent(message, 'error');
    }
    warn(message: LogMessage): void {
        this._sendEvent(message, 'warn');
    }
    debug(message: LogMessage): void {
        this._sendEvent(message, 'debug');
    }
    verbose(message: LogMessage): void {
        this._sendEvent(message, 'verbose');
    }
    trace(message: LogMessage): void {
        this._sendEvent(message, 'trace');
    }
    log(message: LogMessage): void {
        this._sendEvent(message, 'log');
    }
    info(message: LogMessage): void {
        this._sendEvent(message, 'info');
    }
    http(message: LogMessage): void {
        this._sendEvent(message, 'http');
    }
    httpError(message: LogMessage): void {
        this._sendEvent(message, 'httpError');
    }
    silly(message: LogMessage): void {
        this._sendEvent(message, 'silly');
    }
    fatal(message: LogMessage): void {
        this._sendEvent(message, 'fatal');
    }

    async sendEvent(event: LogEvent): Promise<void> {
        if (!this.service.isLogLevelEnabled(this.service.getLogLevel(), event.level)) {
            return;
        }

        if (!this.service.isLogLevelEnabled(this.getLogLevel(), event.level)) {
            return;
        }

        this.getAppenders().append(event);
    }

    private _sendEvent(message: LogMessage, level: LogLevel): void {
        // Build LogEvent with proper field extraction
        const event: LogEvent = {
            context: this.getContext(),
            // biome-ignore lint/suspicious/noExplicitAny: TODO fix any
            level: level as any,
            timestamp: Date.now(),
        };

        // Case 1: Simple string message
        if (typeof message === 'string') {
            event.message = message;
        }
        // Case 2: Error object
        else if (message instanceof Error) {
            event.error = message;
            event.message = message.message;
        }
        // Case 3: Object with fields
        else if (typeof message === 'object' && message !== null) {
            // Extract known fields
            if ('message' in message && typeof message.message === 'string') {
                event.message = message.message;
            }
            if ('error' in message) {
                event.error = message.error;
            }
            if ('data' in message) {
                event.data = message.data;
            }
            if ('context' in message && typeof message.context === 'string') {
                event.context = message.context; // Override default context
            }
            if ('timestamp' in message && typeof message.timestamp === 'number') {
                event.timestamp = message.timestamp; // Override default timestamp
            }

            // If no message/error/data found, treat whole object as data
            if (!event.message && !event.error && !event.data) {
                event.message = 'DATA';
                event.data = message;
            }
        }

        this.sendEvent(event);
    }
}
