import { LogEvent } from '../types/LogEvent';
import { ILifecycle } from './ILifecycle';
import { ILogLevel } from './ILogLevel';
import { ISymbolIdentifier } from './ISymbolIdentifier';

export interface ILoggerAppender extends ILifecycle, ISymbolIdentifier, ILogLevel {
    append(message: LogEvent | LogEvent[]): Promise<void>;
}
