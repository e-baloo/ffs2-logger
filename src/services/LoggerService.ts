import { LoggerAppenders } from '../appenders/LoggerAppenders';
import { Logger } from '../base/Logger';
import { ILogLevel } from '../interfaces/ILogLevel';
import { ILogLevelProvider } from '../interfaces/ILogLevelProvider';
import { ILogger } from '../interfaces/ILogger';
import { ILoggerAppender } from '../interfaces/ILoggerAppender';
import { ILoggerService } from '../interfaces/ILoggerService';
import { LogLevelProvider } from '../providers/LogLevelProvider';
import { LogLevel } from '../types/LogLevel';

export class LoggerService implements ILoggerService, ILogLevel {
    private loggers: Map<symbol, ILogger> = new Map();
    private readonly symbolIdentifier: symbol;

    private appenders = new LoggerAppenders();

    private level: LogLevel = 'info';

    constructor(
        private levelProvider: ILogLevelProvider = new LogLevelProvider()
    ) {
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

        if (this.loggers.has(logger.getSymbolIdentifier())) {
            return this.loggers.get(logger.getSymbolIdentifier())!;
        }

        this.loggers.set(logger.getSymbolIdentifier(), logger);

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

    listAppenders(): symbol[] {
        return this.appenders.listAppenders();
    }
}


