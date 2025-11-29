import type { LogEvent } from '../types/LogEvent';
import type { ILifecycle } from './ILifecycle';
import type { ILogLevel } from './ILogLevel';
import type { ISymbolIdentifier } from './ISymbolIdentifier';

export interface ILoggerAppender extends ILifecycle, ISymbolIdentifier, ILogLevel {
    append(message: LogEvent | LogEvent[]): Promise<void>;
}
