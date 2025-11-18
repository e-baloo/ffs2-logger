import { clc } from '../helpers/cli-colors.util';
import { stringFormat } from '../helpers/stringFormat/stringFormat';
import type { ILoggerAppender } from '../interfaces/ILoggerAppender';
import type { ILoggerService } from '../interfaces/ILoggerService';
import type { LogEvent } from '../types/LogEvent';
import type { LogLevel } from '../types/LogLevel';


interface IConsoleColorized {

    colorize(message: string, logLevel: LogLevel): string;

}


class ConsoleColorized implements IConsoleColorized {

    colorize(message: string, logLevel: LogLevel): string {
        const color = this.colorByLevel(logLevel);
        return color(message);
    }


    private colorByLevel(level: LogLevel): (text: string) => string {
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

interface IConsoleFormatter {
    getTemplate(): string;
    setTemplate(template: string): void;
    formatEvent(event: LogEvent): [string, string | null, string | null];
}

class ConsoleFormatter implements IConsoleFormatter {

    constructor(private colorizer: IConsoleColorized = new ConsoleColorized()) { }

    private template = '{date} {level}{context}: {message}\n';



    // colorize(message: string, logLevel: LogLevel): string {
    //     const color = this.colorByLevel(logLevel);
    //     return color(message);
    // }

    getTemplate(): string {
        return this.template;
    }

    setTemplate(template: string) {
        this.template = template;
    }

    formatEvent(event: LogEvent): [string, string | null, string | null] {
        const message = this.formattedTemplate({
            date: this.formatDate(event),
            level: this.formatLogLevel(event),
            context: this.formatContext(event),
            message: this.formatMessage(event),
        });

        const data = this.formatData(event);

        const error = this.formatError(event);

        return [message, data, error];
    }

    private formattedTemplate(data: { date: string; level: string; context: string; message: string }): string {
        return stringFormat(this.template, data);
    }

    protected formatLogLevel(event: LogEvent): string {
        return this.colorizer.colorize(event.level.substring(0, 9).toUpperCase().padStart(9, ' '), event.level);
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
        return this.colorizer.colorize(`${event.message}`.trim(), event.level);
    }


    private formatError(event: LogEvent): string | null {
        if (!event.error) {
            return null;
        }

        const stack = event.error.stack;

        if (!stack) {
            return null;
        }

        return this.colorizer.colorize(`${stack}\n`, 'error');
    }

    private formatData(event: LogEvent): string | null {
        if (!event.data) {
            return null;
        }
        return this.colorizer.colorize(`${JSON.stringify(event.data, null, 2)}\n`, 'data');
    }

}


interface IConsolePrinter {
    print(message: string, data: string | null, error: string | null, writeStreamType?: 'stdout' | 'stderr'): void;
}

class ConsolePrinter implements IConsolePrinter {
    print(message: string, data: string | null, error: string | null, writeStreamType: 'stdout' | 'stderr' = 'stdout'): void {
        process[writeStreamType].write(message);
        if (data) {
            process.stdout.write(data);
        }
        if (error) {
            process.stderr.write(error);
        }
    }
}



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

    // protected formatEvent(event: LogEvent) {
    //     return this.formattedTemplate({
    //         date: this.formatDate(event),
    //         level: this.formatLogLevel(event),
    //         context: this.formatContext(event),
    //         message: this.formatMessage(event),
    //     });
    // }

    // private formattedTemplate(data: { date: string; level: string; context: string; message: string }): string {
    //     return stringFormat(this.template, data);
    // }

    // protected formatLogLevel(event: LogEvent): string {
    //     return this.colorize(event.level.substring(0, 9).toUpperCase().padStart(9, ' '), event.level);
    // }

    // protected formatContext(event: LogEvent): string {
    //     const CONTEXT_LENGTH = 24;
    //     const context = (event.context ? event.context : '').substring(0, CONTEXT_LENGTH);
    //     return clc.context(`[${' '.repeat(CONTEXT_LENGTH - context.length)}${context}]`);
    // }

    // protected formatDate(event: LogEvent): string {
    //     return new Date(event.timestamp ?? Date.now()).toISOString();
    // }

    // protected formatMessage(event: LogEvent): string {
    //     return this.colorize(`${event.message}`.trim(), event.level);
    // }

    protected printEvent(event: LogEvent, writeStreamType?: 'stdout' | 'stderr') {

        const [message, data, error] = this.formatter.formatEvent(event);

        this.printer.print(message, data, error, writeStreamType);

    }

    // private printData(event: LogEvent): void {
    //     if (!event.data) {
    //         return;
    //     }
    //     process.stdout.write(this.colorize(`${JSON.stringify(event.data, null, 2)}\n`, 'data'));
    // }

    // private printError(event: LogEvent) {
    //     if (!event.error) {
    //         return;
    //     }

    //     const stack = event.error.stack;

    //     if (!stack) {
    //         return;
    //     }
    //     process.stderr.write(this.colorize(`${stack}\n`, 'error'));
    // }

    // private colorize(message: string, logLevel: LogLevel) {
    //     const color = this.getColorByLogLevel(logLevel);
    //     return color(message);
    // }

    // private getColorByLogLevel(level: LogLevel) {
    //     switch (level) {
    //         case 'fatal':
    //             return clc.level.fatal;
    //         case 'error':
    //         case 'httpError':
    //             return clc.level.error;
    //         case 'warn':
    //             return clc.level.warn;
    //         case 'log':
    //         case 'info':
    //             return clc.level.info;
    //         case 'http':
    //             return clc.level.http;
    //         case 'data':
    //             return clc.level.data;
    //         case 'debug':
    //         case 'trace':
    //         case 'verbose':
    //         case 'silly':
    //             return clc.level.trace;

    //         default:
    //             return clc.level.trace;
    //     }
    // }
}
