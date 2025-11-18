import { LogLevel } from './LogLevel';

export type LogEvent = {
    message?: string;
    data?: any;
    context?: string;
    error?: Error | any;
    level: LogLevel;
    timestamp?: number;
};
