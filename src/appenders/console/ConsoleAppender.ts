import type { IConsoleFormatter } from '../../interfaces/console/IConsoleFormatter';
import type { IConsolePrinter } from '../../interfaces/console/IConsolePrinter';
import type { ILoggerAppender } from '../../interfaces/ILoggerAppender';
import type { ILoggerService } from '../../interfaces/ILoggerService';
import type { LogEvent } from '../../types/LogEvent';
import type { LogLevel } from '../../types/LogLevel';
import { ConsoleFormatter } from './ConsoleFormatter';
import { ConsolePrinter } from './ConsolePrinter';








export class ConsoleAppender implements ILoggerAppender {
    private level: LogLevel = 'silly';

    constructor(
        private readonly service: ILoggerService,
        private readonly formatter: IConsoleFormatter = new ConsoleFormatter(),
        private readonly printer: IConsolePrinter = new ConsolePrinter()
    ) { }

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

    initialize(): void { }

    destroy(): void { }

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
