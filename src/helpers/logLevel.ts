// import { LOG_PRIORITY, LogLevel } from '../types/LogLevel';

// const __LOG_LEVEL_PRIORITY_CACHE: Record<LogLevel, number> = (() => {
//     const cache: Partial<Record<LogLevel, number>> = {};
//     LOG_PRIORITY.forEach((levels, index) => {
//         levels.forEach((level) => {
//             cache[level] = index;
//         });
//     });
//     return cache as Record<LogLevel, number>;
// })();

// export const logLevelPriority = (level: LogLevel): number => {
//     return __LOG_LEVEL_PRIORITY_CACHE[level] ?? Number.MAX_SAFE_INTEGER;
// };

// export const isLogLevelEnabled = (currentLevel: LogLevel, targetLevel: LogLevel): boolean => {
//     const currentPriority = logLevelPriority(currentLevel);
//     const targetPriority = logLevelPriority(targetLevel);
//     return (
//         currentPriority < Number.MAX_SAFE_INTEGER &&
//         targetPriority < Number.MAX_SAFE_INTEGER &&
//         targetPriority <= currentPriority
//     );
// };
