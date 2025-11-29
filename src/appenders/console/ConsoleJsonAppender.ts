import { globalContainer } from '../../config/DIConfig';
import { CONSOLE_JSON_FORMATTER_TOKEN, CONSOLE_PRINTER_TOKEN } from '../../constants/DITokens';
import type { IConsoleJsonFormatter } from '../../interfaces/console/IConsoleJsonFormatter';
import type { IConsolePrinter } from '../../interfaces/console/IConsolePrinter';
import type { IDIContainer } from '../../interfaces/di/IDIContainer';
import type { ICompact } from '../../interfaces/ICompact';
import type { ILoggerAppender } from '../../interfaces/ILoggerAppender';
import type { ILoggerService } from '../../interfaces/ILoggerService';
import type { LogEvent } from '../../types/LogEvent';
import type { LogLevel } from '../../types/LogLevel';

/**
 * Appender console avec formatage JSON
 * Hérite de ConsoleAppender mais utilise un formatter JSON par défaut
 */
export class ConsoleJsonAppender implements ILoggerAppender, ICompact {
    private level: LogLevel = 'silly';
    private readonly formatter: IConsoleJsonFormatter;
    private readonly printer: IConsolePrinter;

    constructor(
        private readonly service: ILoggerService,
        formatter?: IConsoleJsonFormatter,
        printer?: IConsolePrinter,
        container: IDIContainer = globalContainer,
        compact = false
    ) {
        this.formatter = formatter ?? container.resolve(CONSOLE_JSON_FORMATTER_TOKEN);
        this.printer = printer ?? container.resolve(CONSOLE_PRINTER_TOKEN);

        this.formatter.setCompact(compact);
    }

    getLogLevel(): LogLevel {
        return this.level;
    }

    setLogLevel(level: LogLevel): void {
        this.level = level;
    }

    getCompact(): boolean {
        return this.formatter.getCompact();
    }

    setCompact(compact: boolean): void {
        this.formatter.setCompact(compact);
    }

    async append(events: LogEvent | LogEvent[]): Promise<void> {
        if (!Array.isArray(events)) {
            events = [events];
        }

        events.forEach(event => {
            if (!this.service.isLogLevelEnabled(this.getLogLevel(), event.level)) {
                return;
            }

            this.printEvent(event);
        });
    }

    initialize(): void {}

    destroy(): void {}

    isInitialized(): boolean {
        return true;
    }

    private readonly symbolIdentifier: symbol = Symbol.for('Appender:ConsoleJsonAppender');

    getSymbolIdentifier(): symbol {
        return this.symbolIdentifier;
    }

    protected printEvent(event: LogEvent, writeStreamType?: 'stdout' | 'stderr') {
        const [message, data, error] = this.formatter.formatEvent(event);

        this.printer.print(`${message}\n`, data, error, writeStreamType);
    }
}
