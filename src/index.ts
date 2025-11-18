import { ConsoleAppender } from './appenders/ConsoleAppender';
import { LoggerService } from './services/LoggerService';

export * from './interfaces/ILogger';
export * from './interfaces/ILoggerAppender';
export * from './providers/LogLevelProvider';
export * from './types/LogLevel';

// Performance optimizations exports
export * from './helpers/LogEventPool';
export * from './helpers/LazyFormatterRegistry';
export * from './appenders/base/AsyncBatchAppender';
export * from './appenders/FileAsyncBatchAppender';

const LOGGER_SERVICE = new LoggerService();
const LOGGER_CONSOLE_APPENDER = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(LOGGER_CONSOLE_APPENDER);

export { LOGGER_SERVICE, LOGGER_CONSOLE_APPENDER };
