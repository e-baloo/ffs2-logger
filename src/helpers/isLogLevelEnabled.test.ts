// import { LogLevel } from '../types/LogLevel';
// import { isLogLevelEnabled } from './logLevel';

// describe('isLogLevelEnabled', () => {
//     it('should return true when target level has higher priority than current level', () => {
//         expect(isLogLevelEnabled('error', 'fatal')).toBe(true);
//         expect(isLogLevelEnabled('warn', 'error')).toBe(true);
//         expect(isLogLevelEnabled('info', 'warn')).toBe(true);
//     });

//     it('should return true when target level has same priority as current level', () => {
//         expect(isLogLevelEnabled('error', 'error')).toBe(true);
//         expect(isLogLevelEnabled('info', 'log')).toBe(true);
//         expect(isLogLevelEnabled('trace', 'debug')).toBe(true);
//     });

//     it('should return false when target level has lower priority than current level', () => {
//         expect(isLogLevelEnabled('fatal', 'error')).toBe(false);
//         expect(isLogLevelEnabled('error', 'warn')).toBe(false);
//         expect(isLogLevelEnabled('warn', 'info')).toBe(false);
//     });

//     it('should return false when target level is invalid', () => {
//         const invalidLevel = 'INVALID' as LogLevel;
//         expect(isLogLevelEnabled('info', invalidLevel)).toBe(false);
//     });

//     it('should return false when current level is invalid', () => {
//         const invalidLevel = 'INVALID' as LogLevel;
//         expect(isLogLevelEnabled(invalidLevel, 'info')).toBe(false);
//     });
// });
