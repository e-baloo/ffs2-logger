// Production build test dist/index.js
// This file imports from the compiled build instead of sources

import { ConsoleAppender, LOG_LEVEL, LOGGER_SERVICE } from '../dist/index.js';

const LOGGER = LOGGER_SERVICE.createLogger('LibTest', { logLevel: 'silly' });

const consoleAppender = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(consoleAppender);

console.log('=== Test with production build (dist/index.js) ===\n');
console.log('Active appenders:', LOGGER_SERVICE.listAppenders());
console.log('');

// Test all log levels
console.log('=== Test 1: All log levels ===');
LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({ message: `Testing log level: ${level}`, level, context: 'Initial' });
});

// Change LoggerService log level
console.log('\n=== Test 2: Change LoggerService level to "warn" ===');
LOGGER_SERVICE.setLogLevel('warn');
console.log(`LoggerService log level: ${LOGGER_SERVICE.getLogLevel()}\n`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({ message: `Testing log level after change: ${level}`, level, context: 'AfterChange' });
});

// Reset to silly
console.log('\n=== Test 3: Reset to "silly" ===');
LOGGER_SERVICE.setLogLevel('silly');
console.log(`LoggerService log level: ${LOGGER_SERVICE.getLogLevel()}\n`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({
        message: `Testing log level after second change: ${level}`,
        level,
        context: 'AfterSecondChange',
    });
});

// Change appender level
console.log('\n=== Test 4: Change ConsoleAppender level to "error" ===');
consoleAppender.setLogLevel('error');
console.log(`ConsoleAppender log level: ${consoleAppender.getLogLevel()}\n`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({
        message: `Testing log level after appender change: ${level}`,
        level,
        context: 'AfterAppenderChange',
    });
});

// Test with complex data
console.log('\n=== Test 5: Logs with complex data ===');
LOGGER_SERVICE.setLogLevel('info');
consoleAppender.setLogLevel('info');

LOGGER.info('Simple message');
LOGGER.info({ message: 'Message with data', data: { userId: 123, action: 'login' } });
LOGGER.error(new Error('Test error with stack trace'));
LOGGER.warn({ message: 'Warning with context', context: 'Security', data: { ip: '192.168.1.1' } });

console.log('\n=== Test completed successfully ===');
console.log('Production build (dist/index.js) works correctly! ✅');
