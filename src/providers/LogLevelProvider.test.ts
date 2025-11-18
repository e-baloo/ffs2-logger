import { beforeEach, describe, expect, it } from '@jest/globals';
import { LOG_PRIORITY, type LogLevel } from '../types/LogLevel';
import { LogLevelProvider } from './LogLevelProvider';

describe('LogLevelProvider', () => {
    let provider: LogLevelProvider;

    beforeEach(() => {
        // Reset environment variable before each test
        delete process.env.LOG_LEVEL;
        provider = new LogLevelProvider();
    });

    describe('constructor', () => {
        it('should use default log level when no parameter provided and no env var', () => {
            const newProvider = new LogLevelProvider();
            expect(newProvider.getLogLevel()).toBe('log');
        });

        it('should use provided log level parameter', () => {
            const newProvider = new LogLevelProvider('error');
            expect(newProvider.getLogLevel()).toBe('error');
        });

        it('should use LOG_LEVEL environment variable when set', () => {
            process.env.LOG_LEVEL = 'debug';
            const newProvider = new LogLevelProvider();
            expect(newProvider.getLogLevel()).toBe('debug');
        });

        it('should fallback to default when LOG_LEVEL env var is invalid', () => {
            process.env.LOG_LEVEL = 'INVALID';
            const newProvider = new LogLevelProvider();
            expect(newProvider.getLogLevel()).toBe('log');
        });

        it('should prioritize constructor parameter over environment variable', () => {
            process.env.LOG_LEVEL = 'debug';
            const newProvider = new LogLevelProvider('error');
            expect(newProvider.getLogLevel()).toBe('error');
        });
    });

    describe('logLevelPriority', () => {
        it('should return priority for "silly"', () => {
            expect(provider.logLevelPriority('silly')).toBe(6);
        });

        it('should return priority for "trace" & "debug"', () => {
            expect(provider.logLevelPriority('trace')).toBe(5);
            expect(provider.logLevelPriority('debug')).toBe(5);
        });

        it('should return priority for "verbose"', () => {
            expect(provider.logLevelPriority('verbose')).toBe(4);
        });

        it('should return priority for "log", "info", "http", "data"', () => {
            expect(provider.logLevelPriority('log')).toBe(3);
            expect(provider.logLevelPriority('info')).toBe(3);
            expect(provider.logLevelPriority('http')).toBe(3);
            expect(provider.logLevelPriority('data')).toBe(3);
        });

        it('should return priority for "warn"', () => {
            expect(provider.logLevelPriority('warn')).toBe(2);
        });

        it('should return priority for "error" & "httpError"', () => {
            expect(provider.logLevelPriority('error')).toBe(1);
            expect(provider.logLevelPriority('httpError')).toBe(1);
        });

        it('should return priority for "fatal"', () => {
            expect(provider.logLevelPriority('fatal')).toBe(0);
        });

        it('should return MAX_SAFE_INTEGER for invalid log level', () => {
            const invalidLevel = 'INVALID' as LogLevel;
            expect(provider.logLevelPriority(invalidLevel)).toBe(Number.MAX_SAFE_INTEGER);
        });

        it('should return consistent results for multiple calls', () => {
            const testLevel: LogLevel = 'fatal'; // Use known first level
            const firstCall = provider.logLevelPriority(testLevel);
            const secondCall = provider.logLevelPriority(testLevel);
            expect(firstCall).toBe(secondCall);
        });
    });

    describe('isLogLevelEnabled', () => {
        it('should return true when target level has higher priority than current level', () => {
            expect(provider.isLogLevelEnabled('error', 'fatal')).toBe(true);
            expect(provider.isLogLevelEnabled('warn', 'error')).toBe(true);
            expect(provider.isLogLevelEnabled('info', 'warn')).toBe(true);
        });

        it('should return true when target level has same priority as current level', () => {
            expect(provider.isLogLevelEnabled('error', 'error')).toBe(true);
            expect(provider.isLogLevelEnabled('info', 'log')).toBe(true);
            expect(provider.isLogLevelEnabled('trace', 'debug')).toBe(true);
        });

        it('should return false when target level has lower priority than current level', () => {
            expect(provider.isLogLevelEnabled('fatal', 'error')).toBe(false);
            expect(provider.isLogLevelEnabled('error', 'warn')).toBe(false);
            expect(provider.isLogLevelEnabled('warn', 'info')).toBe(false);
        });

        it('should return false when target level is invalid', () => {
            const invalidLevel = 'INVALID' as LogLevel;
            expect(provider.isLogLevelEnabled('info', invalidLevel)).toBe(false);
        });

        it('should return false when current level is invalid', () => {
            const invalidLevel = 'INVALID' as LogLevel;
            expect(provider.isLogLevelEnabled(invalidLevel, 'info')).toBe(false);
        });
    });

    describe('getLogLevel', () => {
        it('should return the current log level', () => {
            const newProvider = new LogLevelProvider('warn');
            expect(newProvider.getLogLevel()).toBe('warn');
        });
    });

    describe('priority cache functionality', () => {
        it('should build priority cache correctly for all log levels', () => {
            LOG_PRIORITY.forEach((levels, expectedPriority) => {
                levels.forEach(level => {
                    expect(provider.logLevelPriority(level)).toBe(expectedPriority);
                });
            });
        });

        it('should handle all valid log levels', () => {
            const allLevels: LogLevel[] = [
                'silly',
                'debug',
                'trace',
                'verbose',
                'log',
                'info',
                'http',
                'data',
                'warn',
                'httpError',
                'error',
                'fatal',
            ];

            allLevels.forEach(level => {
                const priority = provider.logLevelPriority(level);
                expect(priority).toBeGreaterThanOrEqual(0);
                expect(priority).toBeLessThan(Number.MAX_SAFE_INTEGER);
            });
        });
    });

    describe('integration tests', () => {
        it('should work correctly with different log level configurations', () => {
            const errorProvider = new LogLevelProvider('error');
            const infoProvider = new LogLevelProvider('info');

            // Error provider should allow error and fatal
            expect(errorProvider.isLogLevelEnabled('error', 'error')).toBe(true);
            expect(errorProvider.isLogLevelEnabled('error', 'fatal')).toBe(true);
            expect(errorProvider.isLogLevelEnabled('error', 'warn')).toBe(false);

            // Info provider should allow info, warn, error, fatal
            expect(infoProvider.isLogLevelEnabled('info', 'info')).toBe(true);
            expect(infoProvider.isLogLevelEnabled('info', 'warn')).toBe(true);
            expect(infoProvider.isLogLevelEnabled('info', 'error')).toBe(true);
            expect(infoProvider.isLogLevelEnabled('info', 'fatal')).toBe(true);
            expect(infoProvider.isLogLevelEnabled('info', 'debug')).toBe(false);
        });

        it('should handle edge cases correctly', () => {
            const sillyProvider = new LogLevelProvider('silly');
            const fatalProvider = new LogLevelProvider('fatal');

            // Silly should allow everything
            expect(sillyProvider.isLogLevelEnabled('silly', 'fatal')).toBe(true);
            expect(sillyProvider.isLogLevelEnabled('silly', 'debug')).toBe(true);

            // Fatal should only allow fatal
            expect(fatalProvider.isLogLevelEnabled('fatal', 'fatal')).toBe(true);
            expect(fatalProvider.isLogLevelEnabled('fatal', 'error')).toBe(false);
        });
    });
});
