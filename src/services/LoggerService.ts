import { LoggerAppenders } from '../appenders/LoggerAppenders';
import { Logger } from '../base/Logger';
import type { ILogger } from '../interfaces/ILogger';
import type { ILoggerAppender } from '../interfaces/ILoggerAppender';
import type { ILoggerService } from '../interfaces/ILoggerService';
import type { ILogLevel } from '../interfaces/ILogLevel';
import type { ILogLevelProvider } from '../interfaces/ILogLevelProvider';
import { LogLevelProvider } from '../providers/LogLevelProvider';
import type { LogLevel } from '../types/LogLevel';

export class LoggerService implements ILoggerService, ILogLevel {
    private loggers: Map<symbol, ILogger> = new Map();
    private readonly symbolIdentifier: symbol;

    private appenders = new LoggerAppenders();

    private level: LogLevel = 'info';

    constructor(private levelProvider: ILogLevelProvider = new LogLevelProvider()) {
        this.symbolIdentifier = Symbol(`LoggerService:LoggerService`);

        this.level = this.levelProvider.getLogLevel();
    }

    isLogLevelEnabled(currentLevel: string, targetLevel: string): boolean {
        return this.levelProvider.isLogLevelEnabled(currentLevel as LogLevel, targetLevel as LogLevel);
    }

    getLogLevelProvider(): ILogLevelProvider {
        return this.levelProvider;
    }

    getLogLevel(): LogLevel {
        return this.level;
    }

    setLogLevel(level: LogLevel): void {
        this.level = level;
    }

    getSymbolIdentifier(): symbol {
        return this.symbolIdentifier;
    }
    // private loggers: Map<string, ILogger> = new Map();

    createLogger(context: string, option?: { logLevel?: LogLevel }): ILogger {
        const logger = new Logger(context, this, this.appenders, option?.logLevel);
        const symbol = logger.getSymbolIdentifier();

        const currentLogger = this.loggers.get(symbol);
        if (currentLogger) {
            return currentLogger;
        }

        this.loggers.set(symbol, logger);

        return logger;
    }

    getLogger(context: string): ILogger | null {
        const logger = new Logger(context, this, this.appenders);

        return this.loggers.get(logger.getSymbolIdentifier()) ?? null;
    }

    addAppender(appender: ILoggerAppender): void {
        this.appenders.addAppender(appender);
    }

    removeAppender(appender: ILoggerAppender): void {
        this.appenders.removeAppender(appender);
    }

    clearAppenders(): void {
        this.appenders.clearAppenders();
    }

    listAppenders(): symbol[] {
        return this.appenders.listAppenders();
    }
}
