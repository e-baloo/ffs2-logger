// import { LOG_PRIORITY, LogLevel } from '../types/LogLevel';
// import { logLevelPriority } from './logLevel';

// describe('logLevelPriority', () => {
//     it('should return priority for "silly"', () => {
//         expect(logLevelPriority('silly')).toBe(6);
//     });

//     it('should return priority for "trace" & "debug"', () => {
//         expect(logLevelPriority('trace')).toBe(5);
//         expect(logLevelPriority('debug')).toBe(5);
//     });

//     it('should return priority for "verbose"', () => {
//         expect(logLevelPriority('verbose')).toBe(4);
//     });

//     it('should return priority for "log", "info", "http", "data"', () => {
//         expect(logLevelPriority('log')).toBe(3);
//         expect(logLevelPriority('info')).toBe(3);
//         expect(logLevelPriority('http')).toBe(3);
//         expect(logLevelPriority('data')).toBe(3);
//     });

//     it('should return priority for "warn" & "httpError"', () => {
//         expect(logLevelPriority('warn')).toBe(2);
//     });

//     it('should return priority for "error"', () => {
//         expect(logLevelPriority('error')).toBe(1);
//         expect(logLevelPriority('httpError')).toBe(1);
//     });

//     it('should return priority for "fatal"', () => {
//         expect(logLevelPriority('fatal')).toBe(0);
//     });

//     it('should return -1 for invalid log level', () => {
//         const invalidLevel = 'INVALID' as LogLevel;
//         expect(logLevelPriority(invalidLevel)).toBe(Number.MAX_SAFE_INTEGER);
//     });

//     it('should return consistent results for multiple calls', () => {
//         const testLevel = LOG_PRIORITY[0][0]; // First level from first priority group
//         const firstCall = logLevelPriority(testLevel);
//         const secondCall = logLevelPriority(testLevel);
//         expect(firstCall).toBe(secondCall);
//     });
// });
