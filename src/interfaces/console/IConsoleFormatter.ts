import type { LogEvent } from '../../types/LogEvent';
import type { ITemplateProvider } from '../ITemplateProvider';

export interface IConsoleFormatter extends ITemplateProvider {
    formatEvent(event: LogEvent): [string, string | null, string | null];
}
