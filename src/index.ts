import { ConsoleAppender } from './appenders/console/ConsoleAppender';
import { LoggerService } from './services/LoggerService';
import './config/DIConfig'; // Initialise le DI container

export * from './appenders/base/AAsyncBatchAppender';
// Console appender exports
export { ConsoleAppender } from './appenders/console/ConsoleAppender';
export { ConsoleColorized } from './appenders/console/ConsoleColorized';
export { ConsoleFormatter } from './appenders/console/ConsoleFormatter';
export { ConsolePrinter } from './appenders/console/ConsolePrinter';
export * from './appenders/FileAsyncBatchAppender';
export { configureDefaultContainer, globalContainer } from './config/DIConfig';
export * from './constants/DITokens';
export * from './helpers/LazyFormatterRegistry';
// Performance optimizations exports
export * from './helpers/LogEventPool';
export * from './interfaces/di/IDIContainer';
// DI exports
export * from './interfaces/di/InjectionToken';
export * from './interfaces/ILogger';
export * from './interfaces/ILoggerAppender';
export * from './providers/LogLevelProvider';
export * from './services/DIContainer';
export * from './types/LogLevel';
// Wreapper instances for easy usage
export * from './wrappers/NestJSLoggerWrapper';


// create default logger service and console appender instances
export const LOGGER_SERVICE = new LoggerService();
LOGGER_SERVICE.addAppender(new ConsoleAppender(LOGGER_SERVICE));


