import type { LogEvent } from '../../types/LogEvent';

export interface IConsoleFormatter {
    formatEvent(event: LogEvent): [string, string | null, string | null];
}
