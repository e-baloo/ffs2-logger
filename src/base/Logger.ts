import { ILoggerAppenders } from '../interfaces/ILoggerAppenders';
import { ILoggerService } from '../interfaces/ILoggerService';
import { LogLevel } from '../types/LogLevel';
import { ALogger } from './ALogger';

export class Logger extends ALogger {
    constructor(
        context: string = 'default',
        service: ILoggerService,
        appenders: ILoggerAppenders,
        logLevel?: LogLevel,
    ) {
        super(context, service, appenders, logLevel);
    }
}
