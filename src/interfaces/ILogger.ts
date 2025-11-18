import type { LogEvent } from '../types/LogEvent';
import type { LogMessage } from '../types/LogMessage';
import type { ILogLevel } from './ILogLevel';
import type { ISymbolIdentifier } from './ISymbolIdentifier';

export interface ILogger extends ISymbolIdentifier, ILogLevel {
    /**
     * Write a 'trace' level log.
     */
    trace(message: LogMessage): void;

    /**
     * Write a 'log' level log.
     */
    log(message: LogMessage): void;

    /**
     * Write an 'error' level log.
     */
    error(message: LogMessage): void;

    /**
     * Write a 'warn' level log.
     */
    warn(message: LogMessage): void;

    /**
     * Write a 'debug' level log.
     */
    debug(message: LogMessage): void;

    /**
     * Write a 'verbose' level log.
     */
    verbose(message: LogMessage): void;

    /**
     * Write an 'info' level log.
     */
    info(message: LogMessage): void;

    /**
     * Write an 'http' level log.
     */
    http(message: LogMessage): void;

    /**
     * Write an 'httpError' level log.
     */
    httpError(message: LogMessage): void;

    /**
     * Write a 'data' level log.
     */
    data(message: LogMessage): void;

    /**
     * Write a 'silly' level log.
     */
    silly(message: LogMessage): void;

    /**
     * Write a 'fatal' level log.
     */
    fatal(message: LogMessage): void;

    sendEvent(event: LogEvent): Promise<void>;

    getContext(): string;
}
