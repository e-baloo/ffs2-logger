import { ConsoleAppender } from './appenders/ConsoleAppender';
import { LoggerService } from './services/LoggerService';

export * from './types/LogLevel';
export * from './interfaces/ILoggerAppender';
export * from './interfaces/ILogger';
export * from './providers/LogLevelProvider';


const LOGGER_SERVICE = new LoggerService();
const LOGGER_CONSOLE_APPENDER = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(LOGGER_CONSOLE_APPENDER);

export { LOGGER_SERVICE, LOGGER_CONSOLE_APPENDER };
