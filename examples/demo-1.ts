import { LOGGER_SERVICE } from '../src';
import { ConsoleAppender } from '../src/appenders/console/ConsoleAppender';
import { LOG_LEVEL } from '../src/types/LogLevel';

const LOGGER = LOGGER_SERVICE.createLogger('Logger', { logLevel: 'silly' });

const consoleAppender = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(consoleAppender);

console.log(LOGGER_SERVICE.listAppenders());

// LOGGER.warn('LoggerService initialized');
// LOGGER.trace('LoggerService initialized');
// LOGGER.trace(new Error('test'));
// LOGGER.debug({ test: 123 });

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({ message: `Testing log level: ${level}`, level, context: 'Initial' });
});

LOGGER_SERVICE.setLogLevel('warn');
console.log(`LoggerService log level set to: ${LOGGER_SERVICE.getLogLevel()}`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({ message: `Testing log level after change: ${level}`, level, context: 'AfterChange' });
});

LOGGER_SERVICE.setLogLevel('silly');
console.log(`LoggerService log level set to: ${LOGGER_SERVICE.getLogLevel()}`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({
        message: `Testing log level after second change: ${level}`,
        level,
        context: 'AfterSecondChange',
    });
});

consoleAppender.setLogLevel('error');
console.log(`ConsoleAppender log level set to: ${consoleAppender.getLogLevel()}`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({
        message: `Testing log level after appender change: ${level}`,
        level,
        context: 'AfterAppenderChange',
    });
});

LOGGER_SERVICE.addAppender(new ConsoleAppender(LOGGER_SERVICE));

console.log(`Total appenders after adding another: ${LOGGER_SERVICE.listAppenders().length}`);

LOGGER.info('LoggerService test completed.');
LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({
        message: `Testing log level after appender change: ${level}`,
        level,
        context: 'AfterAppenderChange',
    });
});



LOGGER.fatal(new Error('Final test error'));

LOGGER.trace({ foo: 'bar', age: 42, active: true });
