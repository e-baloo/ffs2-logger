import { stringFormat } from "../../helpers/stringFormat/stringFormat";
import type { IConsoleColorized } from "../../interfaces/console/IConsoleColorized";
import type { IConsoleFormatter } from "../../interfaces/console/IConsoleFormatter";
import type { ITemplateProvider } from "../../interfaces/ITemplateProvider";
import { TemplateProvider } from "../../providers/TemplateProvider";
import type { LogEvent } from "../../types/LogEvent";
import type { LogLevel } from "../../types/LogLevel";
import { ConsoleColorized } from "./ConsoleColorized";

export class ConsoleFormatter implements IConsoleFormatter {

    constructor(
        private colorizer: IConsoleColorized = new ConsoleColorized(),
        private templateProvider: ITemplateProvider = new TemplateProvider()
    ) { }


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
        return stringFormat(this.templateProvider.getTemplate(), data);
    }

    protected formatLogLevel(event: LogEvent): string {
        return this.colorizer.colorize(event.level.substring(0, 9).toUpperCase().padStart(9, ' '), event.level);
    }

    protected formatContext(event: LogEvent): string {
        const CONTEXT_LENGTH = 24;
        const context = (event.context ? event.context : '').substring(0, CONTEXT_LENGTH);
        return this.colorizer.colorize(`[${' '.repeat(CONTEXT_LENGTH - context.length)}${context}]`, 'context' as LogLevel);
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