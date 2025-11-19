/**
 * Démonstration du ConsoleJsonAppender
 */

import { LOGGER_SERVICE } from '../src/index';
import { ConsoleJsonAppender } from '../src/appenders/console/ConsoleJsonAppender';

console.log('='.repeat(80));
console.log('📊 Démonstration ConsoleJsonAppender');
console.log('='.repeat(80));
console.log();

// ============================================================================
// Exemple 1: JSON Formatter Standard (Pretty Print)
// ============================================================================
console.log('📋 Exemple 1: Format JSON standard (pretty print)');
console.log('-'.repeat(80));

const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);
LOGGER_SERVICE.clearAppenders();
LOGGER_SERVICE.addAppender(jsonAppender);

const logger1 = LOGGER_SERVICE.createLogger('JsonDemo');

logger1.info('Message d\'information simple');
logger1.warn('Attention: quelque chose d\'important');
logger1.error('Une erreur s\'est produite');

console.log();

// ============================================================================
// Exemple 2: JSON Compact (Une ligne)
// ============================================================================
console.log('📦 Exemple 2: Format JSON compact (une ligne)');
console.log('-'.repeat(80));

const compactAppender = new ConsoleJsonAppender(LOGGER_SERVICE, undefined, undefined, undefined, true);
LOGGER_SERVICE.clearAppenders();
LOGGER_SERVICE.addAppender(compactAppender);

const logger2 = LOGGER_SERVICE.createLogger('CompactJson');

logger2.info('Message compact');
logger2.debug('Debug en format compact');

console.log();

// ============================================================================
// Exemple 3: JSON avec données complexes
// ============================================================================
console.log('🔍 Exemple 3: JSON avec données complexes');
console.log('-'.repeat(80));

const logger3 = LOGGER_SERVICE.createLogger('ComplexData');

// Log avec données
logger3.log('Données utilisateur');

// Log avec erreur
try {
    throw new Error('Erreur de test avec stack trace');
} catch (error) {
    logger3.error('Erreur capturée');
}

console.log();

// ============================================================================
// Exemple 4: Comparaison des formats
// ============================================================================
console.log('⚖️ Exemple 4: Différents niveaux de log en JSON');
console.log('-'.repeat(80));

const logger4 = LOGGER_SERVICE.createLogger('AllLevels');

logger4.fatal('Erreur fatale système');
logger4.error('Erreur application');
logger4.warn('Avertissement');
logger4.info('Information');
logger4.http('Requête HTTP');
logger4.debug('Debug info');
logger4.trace('Trace détaillée');

console.log();


// ============================================================================
// Exemple 4: Comparaison des formats
// ============================================================================
console.log('⚖️ Exemple 5: Différents niveaux de log en JSON');
console.log('-'.repeat(80));

const logger5 = LOGGER_SERVICE.createLogger('AllLevels');

logger5.fatal(new Error('Erreur fatale système'));
logger5.data({ user: 'alice', action: 'login', success: true });

console.log();

// ============================================================================
// Résumé
// ============================================================================
console.log('='.repeat(80));
console.log('✨ Résumé ConsoleJsonAppender');
console.log('='.repeat(80));
console.log();
console.log('✅ Format JSON structuré pour parsing facile');
console.log('✅ Support des données complexes (objets, tableaux)');
console.log('✅ Capture complète des erreurs (message, stack, name)');
console.log('✅ Timestamp ISO 8601 automatique');
console.log('✅ Mode compact ou pretty print');
console.log('✅ Compatible avec les outils d\'analyse de logs (ELK, Splunk, etc.)');
console.log();
console.log('🎯 Cas d\'usage:');
console.log('   - Production: logs structurés pour agrégation');
console.log('   - CI/CD: parsing automatique des logs');
console.log('   - Monitoring: intégration avec outils de surveillance');
console.log('   - Debugging: format lisible avec données complètes');
console.log();
console.log('='.repeat(80));
