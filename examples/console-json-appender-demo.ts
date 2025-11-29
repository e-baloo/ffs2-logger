/**
 * ConsoleJsonAppender Demonstration
 */

import { ConsoleJsonAppender } from '../src/appenders/console/ConsoleJsonAppender';
import { LOGGER_SERVICE } from '../src/index';

console.log('='.repeat(80));
console.log('📊 ConsoleJsonAppender Demonstration');
console.log('='.repeat(80));
console.log();

// ============================================================================
// Example 1: Standard JSON Formatter (Pretty Print)
// ============================================================================
console.log('📋 Example 1: Standard JSON format (pretty print)');
console.log('-'.repeat(80));

const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);
LOGGER_SERVICE.clearAppenders();
LOGGER_SERVICE.addAppender(jsonAppender);

const logger1 = LOGGER_SERVICE.createLogger('JsonDemo');

logger1.info('Simple information message');
logger1.warn('Warning: something important');
logger1.error('An error occurred');

console.log();

// ============================================================================
// Example 2: Compact JSON (One line)
// ============================================================================
console.log('📦 Example 2: Compact JSON format (one line)');
console.log('-'.repeat(80));

const compactAppender = new ConsoleJsonAppender(LOGGER_SERVICE, undefined, undefined, undefined, true);
LOGGER_SERVICE.clearAppenders();
LOGGER_SERVICE.addAppender(compactAppender);

const logger2 = LOGGER_SERVICE.createLogger('CompactJson');

logger2.info('Compact message');
logger2.debug('Debug in compact format');

console.log();

// ============================================================================
// Example 3: JSON with complex data
// ============================================================================
console.log('🔍 Example 3: JSON with complex data');
console.log('-'.repeat(80));

const logger3 = LOGGER_SERVICE.createLogger('ComplexData');

// Log with data
logger3.log('User data');

// Log with error
try {
    throw new Error('Test error with stack trace');
} catch (error) {
    logger3.error('Error captured');
}

console.log();

// ============================================================================
// Example 4: Format comparison
// ============================================================================
console.log('⚖️ Example 4: Different log levels in JSON');
console.log('-'.repeat(80));

const logger4 = LOGGER_SERVICE.createLogger('AllLevels');

logger4.fatal('Fatal system error');
logger4.error('Application error');
logger4.warn('Warning');
logger4.info('Information');
logger4.http('HTTP Request');
logger4.debug('Debug info');
logger4.trace('Detailed trace');

console.log();


// ============================================================================
// Example 5: Format comparison
// ============================================================================
console.log('⚖️ Example 5: Different log levels in JSON');
console.log('-'.repeat(80));

const logger5 = LOGGER_SERVICE.createLogger('AllLevels');

logger5.fatal(new Error('Fatal system error'));
logger5.data({ user: 'alice', action: 'login', success: true });

console.log();

// ============================================================================
// Summary
// ============================================================================
console.log('='.repeat(80));
console.log('✨ ConsoleJsonAppender Summary');
console.log('='.repeat(80));
console.log();
console.log('✅ Structured JSON format for easy parsing');
console.log('✅ Support for complex data (objects, arrays)');
console.log('✅ Full error capture (message, stack, name)');
console.log('✅ Automatic ISO 8601 Timestamp');
console.log('✅ Compact mode or pretty print');
console.log('✅ Compatible with log analysis tools (ELK, Splunk, etc.)');
console.log();
console.log('🎯 Use cases:');
console.log('   - Production: structured logs for aggregation');
console.log('   - CI/CD: automatic log parsing');
console.log('   - Monitoring: integration with monitoring tools');
console.log('   - Debugging: readable format with complete data');
console.log();
console.log('='.repeat(80));
