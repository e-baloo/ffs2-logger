import type { LogLevel } from '../../types/LogLevel';

export interface IConsoleColorized {
    colorize(message: string, logLevel: LogLevel): string;
}
