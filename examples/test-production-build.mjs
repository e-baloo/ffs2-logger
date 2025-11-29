// Test du build de production dist/index.js
// Ce fichier importe depuis le build compilé au lieu des sources

import { LOGGER_SERVICE, ConsoleAppender, LOG_LEVEL } from '../dist/index.js';

const LOGGER = LOGGER_SERVICE.createLogger('LibTest', { logLevel: 'silly' });

const consoleAppender = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(consoleAppender);

console.log('=== Test avec le build de production (dist/index.js) ===\n');
console.log('Appenders actifs:', LOGGER_SERVICE.listAppenders());
console.log('');

// Test de tous les niveaux de log
console.log('=== Test 1: Tous les niveaux de log ===');
LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({ message: `Testing log level: ${level}`, level, context: 'Initial' });
});

// Changement du niveau de log du service
console.log('\n=== Test 2: Changement niveau LoggerService à "warn" ===');
LOGGER_SERVICE.setLogLevel('warn');
console.log(`LoggerService log level: ${LOGGER_SERVICE.getLogLevel()}\n`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({ message: `Testing log level after change: ${level}`, level, context: 'AfterChange' });
});

// Remise à silly
console.log('\n=== Test 3: Remise à "silly" ===');
LOGGER_SERVICE.setLogLevel('silly');
console.log(`LoggerService log level: ${LOGGER_SERVICE.getLogLevel()}\n`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({
        message: `Testing log level after second change: ${level}`,
        level,
        context: 'AfterSecondChange',
    });
});

// Changement du niveau de l'appender
console.log('\n=== Test 4: Changement niveau ConsoleAppender à "error" ===');
consoleAppender.setLogLevel('error');
console.log(`ConsoleAppender log level: ${consoleAppender.getLogLevel()}\n`);

LOG_LEVEL.forEach(level => {
    LOGGER.sendEvent({
        message: `Testing log level after appender change: ${level}`,
        level,
        context: 'AfterAppenderChange',
    });
});

// Test avec données complexes
console.log('\n=== Test 5: Logs avec données complexes ===');
LOGGER_SERVICE.setLogLevel('info');
consoleAppender.setLogLevel('info');

LOGGER.info('Simple message');
LOGGER.info({ message: 'Message avec data', data: { userId: 123, action: 'login' } });
LOGGER.error(new Error('Test error avec stack trace'));
LOGGER.warn({ message: 'Warning avec contexte', context: 'Security', data: { ip: '192.168.1.1' } });

console.log('\n=== Test terminé avec succès ===');
console.log('Le build de production (dist/index.js) fonctionne correctement! ✅');
