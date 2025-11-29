import type { ILoggerAppenders } from '../interfaces/ILoggerAppenders';
import type { ILoggerService } from '../interfaces/ILoggerService';
import type { LogLevel } from '../types/LogLevel';
import { ALogger } from './ALogger';

export class Logger extends ALogger {
    constructor(
        context: string = 'default',
        service: ILoggerService,
        appenders: ILoggerAppenders,
        logLevel?: LogLevel
    ) {
        super(context, service, appenders, logLevel);
    }
}
