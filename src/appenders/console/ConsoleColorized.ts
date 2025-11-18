import type { IConsoleColorized } from "../../interfaces/console/IConsoleColorized";
import type { LogLevel } from "../../types/LogLevel";
import { clc } from "./cli-colors.util";

export class ConsoleColorized implements IConsoleColorized {

    colorize(message: string, logLevel: LogLevel): string {
        const color = this.colorByLevel(logLevel);
        return color(message);
    }

    private colorByLevel(level: LogLevel): (text: string) => string {
        switch (level) {
            case 'fatal':
                return clc.fatal;
            case 'error':
                return clc.error;
            case 'httpError':
                return clc.httperror;
            case 'warn':
                return clc.warn;
            case 'log':
            case 'info':
                return clc.info;
            case 'http':
                return clc.http;
            case 'data':
                return clc.data;
            case 'verbose':
                return clc.verbose;
            case 'debug':
            case 'trace':
            case 'silly':
                return clc.trace;
            case 'context' as LogLevel:
                return clc.context;

            default:
                return clc.trace;
        }
    }

}