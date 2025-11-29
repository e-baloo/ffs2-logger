/** biome-ignore-all lint/suspicious/noExplicitAny: use any for flexibility */
import type { LogLevel } from './LogLevel';

export type LogEvent = {
    message?: string;
    data?: any;
    context?: string;
    error?: Error | any;
    level: LogLevel;
    timestamp?: number;
};
