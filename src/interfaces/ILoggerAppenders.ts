import { LogEvent } from '../types/LogEvent';
import { ILoggerAppender } from './ILoggerAppender';

export interface ILoggerAppenders {
    append(message: LogEvent | LogEvent[]): Promise<void>;
    addAppender(appender: ILoggerAppender): void;
    removeAppender(appender: ILoggerAppender): void;
    listAppenders(): symbol[];
}
