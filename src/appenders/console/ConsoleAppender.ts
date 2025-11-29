import type { IDIContainer } from '../..';
import { globalContainer } from '../../config/DIConfig';
import { CONSOLE_FORMATTER_TOKEN, CONSOLE_PRINTER_TOKEN } from '../../constants/DITokens';
import type { IConsoleFormatter } from '../../interfaces/console/IConsoleFormatter';
import type { IConsolePrinter } from '../../interfaces/console/IConsolePrinter';
import type { ILoggerAppender } from '../../interfaces/ILoggerAppender';
import type { ILoggerService } from '../../interfaces/ILoggerService';
import type { LogEvent } from '../../types/LogEvent';
import type { LogLevel } from '../../types/LogLevel';

export class ConsoleAppender implements ILoggerAppender {
    private level: LogLevel = 'silly';
    private readonly formatter: IConsoleFormatter;
    private readonly printer: IConsolePrinter;

    constructor(
        private readonly service: ILoggerService,
        formatter?: IConsoleFormatter,
        printer?: IConsolePrinter,
        container: IDIContainer = globalContainer
    ) {
        // Utilise le DI container si les dépendances ne sont pas fournies
        this.formatter = formatter ?? container.resolve(CONSOLE_FORMATTER_TOKEN);
        this.printer = printer ?? container.resolve(CONSOLE_PRINTER_TOKEN);
    }

    getLogLevel(): LogLevel {
        return this.level;
    }

    setLogLevel(level: LogLevel): void {
        this.level = level;
    }

    // private template = '{date} {level}{context}: {message}\n';

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

    private readonly symbolIdentifier: symbol = Symbol.for('Appender:ConsoleAppender');

    getSymbolIdentifier(): symbol {
        return this.symbolIdentifier;
    }

    protected printEvent(event: LogEvent, writeStreamType?: 'stdout' | 'stderr') {
        const [message, data, error] = this.formatter.formatEvent(event);

        this.printer.print(message, data, error, writeStreamType);
    }
}
