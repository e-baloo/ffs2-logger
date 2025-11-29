import type { LogLevel } from '../types/LogLevel';
import type { IisLogLevelEnabled } from './IisLogLevelEnabled';

export interface ILogLevelProvider extends IisLogLevelEnabled {
    getLogLevel(): LogLevel;
    logLevelPriority(level: LogLevel): number;
}
