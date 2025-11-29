import type { ILoggerAppender } from '../interfaces/ILoggerAppender';
import type { ILoggerAppenders } from '../interfaces/ILoggerAppenders';
import type { LogEvent } from '../types/LogEvent';

export class LoggerAppenders implements ILoggerAppenders {
    constructor(appenders: ILoggerAppender[] = []) {
        for (const appender of appenders) {
            this.addAppender(appender);
        }
    }

    listAppenders(): symbol[] {
        return Array.from(this.appenders.keys());
    }

    private appenders: Map<symbol, ILoggerAppender> = new Map();

    async append(event: LogEvent | LogEvent[]): Promise<void> {
        const appenders: ILoggerAppender[] = Array.from(this.appenders.values());

        for (const appender of appenders) {
            appender.append(event);
        }
    }

    addAppender(appender: ILoggerAppender): void {
        if (this.appenders.has(appender.getSymbolIdentifier())) {
            return;
        }

        this.appenders.set(appender.getSymbolIdentifier(), appender);
    }

    removeAppender(appender: ILoggerAppender): void {
        this.appenders.delete(appender.getSymbolIdentifier());
    }

    clearAppenders(): void {
        this.appenders.clear();
    }
}
