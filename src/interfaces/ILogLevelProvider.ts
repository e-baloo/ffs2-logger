import { LogLevel } from '../types/LogLevel';
import { IisLogLevelEnabled } from './IisLogLevelEnabled';

export interface ILogLevelProvider extends IisLogLevelEnabled{
    getLogLevel(): LogLevel;
    logLevelPriority(level: LogLevel): number;
}
