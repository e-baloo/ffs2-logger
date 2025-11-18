import { ConsoleAppender } from './appenders/console/ConsoleAppender';
import { LoggerService } from './services/LoggerService';
import './config/DIConfig'; // Initialise le DI container

export * from './interfaces/ILogger';
export * from './interfaces/ILoggerAppender';
export * from './providers/LogLevelProvider';
export * from './types/LogLevel';

// Performance optimizations exports
export * from './helpers/LogEventPool';
export * from './helpers/LazyFormatterRegistry';
export * from './appenders/base/AAsyncBatchAppender';
export * from './appenders/FileAsyncBatchAppender';

// DI exports
export * from './interfaces/di/InjectionToken';
export * from './interfaces/di/IDIContainer';
export * from './services/DIContainer';
export * from './constants/DITokens';
export { globalContainer, configureDefaultContainer } from './config/DIConfig';

// Console appender exports
export { ConsoleAppender } from './appenders/console/ConsoleAppender';
export { ConsoleColorized } from './appenders/console/ConsoleColorized';
export { ConsoleFormatter } from './appenders/console/ConsoleFormatter';
export { ConsolePrinter } from './appenders/console/ConsolePrinter';

const LOGGER_SERVICE = new LoggerService();
const LOGGER_CONSOLE_APPENDER = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(LOGGER_CONSOLE_APPENDER);

export { LOGGER_SERVICE, LOGGER_CONSOLE_APPENDER };
