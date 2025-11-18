import { LogLevel } from '../types/LogLevel';
import { IGetterLogLevel } from './IGetLogLevel';
import { IisLogLevelEnabled } from './IisLogLevelEnabled';
import { ILogger } from './ILogger';
import { ILogLevelProvider } from './ILogLevelProvider';
import { ISymbolIdentifier } from './ISymbolIdentifier';

export interface ILoggerService extends ISymbolIdentifier, IGetterLogLevel, IisLogLevelEnabled {
    createLogger(context: string, option?: { logLevel?: LogLevel }): ILogger;
    getLogger(context: string): ILogger | null;
    getLogLevelProvider(): ILogLevelProvider;
}
