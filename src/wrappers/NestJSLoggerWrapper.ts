/** biome-ignore-all lint/suspicious/noExplicitAny: compatibility with NestJS */
import type { ILogger } from '../interfaces/ILogger';
import type { LogMessage } from '../types/LogMessage';

/**
 * NestJS LoggerService Interface
 * Replicates the official interface to avoid dependency on @nestjs/common
 */
export interface LoggerService {
    log(message: any, ...optionalParams: any[]): any;
    error(message: any, ...optionalParams: any[]): any;
    warn(message: any, ...optionalParams: any[]): any;
    debug?(message: any, ...optionalParams: any[]): any;
    verbose?(message: any, ...optionalParams: any[]): any;
    fatal?(message: any, ...optionalParams: any[]): any;
}

/**
 * Wrapper to integrate a FFS2 Logger with the NestJS LoggerService interface
 * Allows using the FFS2 logging system in a NestJS application
 */
export class NestJSLoggerWrapper implements LoggerService {
    /**
     * @param logger - FFS2 logger instance to wrap
     * @param context - Optional context for all logs (e.g., module name)
     */
    constructor(
        private readonly logger: ILogger,
        private context?: string
    ) { }

    /**
     * Sets or modifies the logger context
     * @param context - New context to use
     */
    setContext(context: string): void {
        this.context = context;
    }

    /**
     * Gets the current logger context
     */
    getContext(): string | undefined {
        return this.context;
    }

    /**
     * Info level log (main NestJS method)
     * @param message - Message to log
     * @param context - Optional context that overrides the default context
     */
    log(message: LogMessage, context?: string): void {
        this.logger.info(this.formatMessage(message, context));
    }

    /**
     * Error log
     * @param message - Error message
     * @param trace - Optional stack trace
     * @param context - Optional context
     */
    error(message: LogMessage, trace?: string, context?: string): void {
        const formattedMessage = this.formatMessage(message, context);

        if (trace) {
            this.logger.error({
                message: formattedMessage,
                error: new Error(trace),
            });
        } else {
            this.logger.error(formattedMessage);
        }
    }

    /**
     * Warning log
     * @param message - Warning message
     * @param context - Optional context
     */
    warn(message: LogMessage, context?: string): void {
        this.logger.warn(this.formatMessage(message, context));
    }

    /**
     * Debug log
     * @param message - Debug message
     * @param context - Optional context
     */
    debug(message: LogMessage, context?: string): void {
        this.logger.debug(this.formatMessage(message, context));
    }

    /**
     * Verbose log
     * @param message - Verbose message
     * @param context - Optional context
     */
    verbose(message: LogMessage, context?: string): void {
        this.logger.verbose(this.formatMessage(message, context));
    }

    /**
     * Fatal log (extension of the standard NestJS interface)
     * @param message - Fatal message
     * @param context - Optional context
     */
    fatal(message: LogMessage, context?: string): void {
        this.logger.fatal(this.formatMessage(message, context));
    }

    /**
     * Formats the message by adding the context if necessary
     * @param message - Original message
     * @param context - Specific context or uses the default context
     * @returns Formatted message with context
     */
    private formatMessage(message: LogMessage, context?: string): LogMessage {
        const finalContext = context || this.context;

        if (!finalContext) {
            return message;
        }

        // If the message is a string, add the context as a prefix
        if (typeof message === 'string') {
            return `[${finalContext}] ${message}`;
        }

        // If the message is an object, add the context as a property
        if (typeof message === 'object' && message !== null) {
            return {
                ...message,
                context: finalContext,
            };
        }

        return message;
    }
}
