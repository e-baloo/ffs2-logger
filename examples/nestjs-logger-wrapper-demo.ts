import { LOGGER_SERVICE } from '../src/index';
import { NestJSLoggerWrapper } from '../src/wrappers/NestJSLoggerWrapper';

/**
 * Exemple d'utilisation du NestJSLoggerWrapper
 * Montre comment intégrer le logger FFS2 avec NestJS
 */

console.log('=== Exemple 1: Utilisation basique ===\n');
{
    // Créer un logger FFS2
    const ffs2Logger = LOGGER_SERVICE.createLogger('MyApp');

    // Wrapper pour NestJS
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger);

    // Utiliser comme un logger NestJS standard
    nestLogger.log('Application démarrée');
    nestLogger.error('Une erreur est survenue');
    nestLogger.warn('Attention: limite de mémoire atteinte');
    nestLogger.debug('Variable x = 42');
    nestLogger.verbose('Détails de la requête');
}

console.log('\n=== Exemple 2: Avec contexte par défaut ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('Auth');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'AuthService');

    nestLogger.log('Utilisateur connecté');
    nestLogger.warn('Tentative de connexion échouée');
    nestLogger.error('Token invalide');
}

console.log('\n=== Exemple 3: Override du contexte ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('API');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'DefaultContext');

    nestLogger.log('Message avec contexte par défaut');
    nestLogger.log('Message avec contexte override', 'CustomContext');

    // Changer le contexte par défaut
    nestLogger.setContext('NewContext');
    nestLogger.log('Message avec nouveau contexte');
}

console.log('\n=== Exemple 4: Erreur avec stack trace ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('ErrorHandler');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'AppModule');

    try {
        throw new Error('Erreur de test');
    } catch (error) {
        const err = error as Error;
        nestLogger.error(
            'Une erreur critique est survenue',
            err.stack,
            'ErrorBoundary'
        );
    }
}

console.log('\n=== Exemple 5: Messages complexes ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('DataService');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'Database');

    // Message objet
    nestLogger.log({
        message: 'Connexion à la base de données',
        data: {
            host: 'localhost',
            port: 5432,
            database: 'myapp'
        }
    });

    // Message avec métadonnées
    nestLogger.warn({
        message: 'Requête lente détectée',
        data: {
            query: 'SELECT * FROM users',
            duration: 2500
        }
    });
}

console.log('\n=== Exemple 6: Intégration avec NestJS Bootstrap ===\n');
{
    // Simulation de l'utilisation dans main.ts de NestJS
    const ffs2Logger = LOGGER_SERVICE.createLogger('NestApplication');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'Bootstrap');

    nestLogger.log('NestJS application starting...');
    nestLogger.log('Environment: development');
    nestLogger.log('Port: 3000');
    nestLogger.log('NestJS application successfully started');

    // Dans un vrai projet NestJS:
    // const app = await NestFactory.create(AppModule, {
    //     logger: nestLogger
    // });
}
