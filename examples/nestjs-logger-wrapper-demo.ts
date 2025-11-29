import { LOGGER_SERVICE } from '../src/index';
import { NestJSLoggerWrapper } from '../src/wrappers/NestJSLoggerWrapper';

/**
 * NestJSLoggerWrapper Usage Example
 * Shows how to integrate the FFS2 logger with NestJS
 */

console.log('=== Example 1: Basic Usage ===\n');
{
    // Create an FFS2 logger
    const ffs2Logger = LOGGER_SERVICE.createLogger('MyApp');

    // Wrapper for NestJS
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger);

    // Use as a standard NestJS logger
    nestLogger.log('Application started');
    nestLogger.error('An error occurred');
    nestLogger.warn('Warning: memory limit reached');
    nestLogger.debug('Variable x = 42');
    nestLogger.verbose('Request details');
}

console.log('\n=== Example 2: With default context ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('Auth');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'AuthService');

    nestLogger.log('User connected');
    nestLogger.warn('Failed login attempt');
    nestLogger.error('Invalid token');
}

console.log('\n=== Example 3: Context Override ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('API');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'DefaultContext');

    nestLogger.log('Message with default context');
    nestLogger.log('Message with context override', 'CustomContext');

    // Change default context
    nestLogger.setContext('NewContext');
    nestLogger.log('Message with new context');
}

console.log('\n=== Example 4: Error with stack trace ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('ErrorHandler');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'AppModule');

    try {
        throw new Error('Test error');
    } catch (error) {
        const err = error as Error;
        nestLogger.error(
            'A critical error occurred',
            err.stack,
            'ErrorBoundary'
        );
    }
}

console.log('\n=== Example 5: Complex Messages ===\n');
{
    const ffs2Logger = LOGGER_SERVICE.createLogger('DataService');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'Database');

    // Object message
    nestLogger.log({
        message: 'Connecting to database',
        data: {
            host: 'localhost',
            port: 5432,
            database: 'myapp'
        }
    });

    // Message with metadata
    nestLogger.warn({
        message: 'Slow query detected',
        data: {
            query: 'SELECT * FROM users',
            duration: 2500
        }
    });
}

console.log('\n=== Example 6: Integration with NestJS Bootstrap ===\n');
{
    // Simulation of usage in NestJS main.ts
    const ffs2Logger = LOGGER_SERVICE.createLogger('NestApplication');
    const nestLogger = new NestJSLoggerWrapper(ffs2Logger, 'Bootstrap');

    nestLogger.log('NestJS application starting...');
    nestLogger.log('Environment: development');
    nestLogger.log('Port: 3000');
    nestLogger.log('NestJS application successfully started');

    // In a real NestJS project:
    // const app = await NestFactory.create(AppModule, {
    //     logger: nestLogger
    // });
}
