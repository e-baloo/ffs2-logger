import type { LogLevel } from '../types/LogLevel';
import type { IGetterLogLevel } from './IGetLogLevel';
import type { IisLogLevelEnabled } from './IisLogLevelEnabled';
import type { ILogger } from './ILogger';
import type { ILogLevelProvider } from './ILogLevelProvider';
import type { ISymbolIdentifier } from './ISymbolIdentifier';

export interface ILoggerService extends ISymbolIdentifier, IGetterLogLevel, IisLogLevelEnabled {
    createLogger(context: string, option?: { logLevel?: LogLevel }): ILogger;
    getLogger(context: string): ILogger | null;
    getLogLevelProvider(): ILogLevelProvider;
}
