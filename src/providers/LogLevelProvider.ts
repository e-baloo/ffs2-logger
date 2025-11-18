import { ILogLevelProvider } from '../interfaces/ILogLevelProvider';
import { LOG_LEVEL, LOG_PRIORITY, LogLevel } from '../types/LogLevel';

const DEFAULT_LOG_LEVEL: LogLevel = 'log';

export class LogLevelProvider implements ILogLevelProvider {
    private level: LogLevel;
    private priorityCache: Record<LogLevel, number>;

    constructor(level?: LogLevel) {
        this.level = level ?? this.getProcessLogLevel();

        this.priorityCache = this.buildPriorityCache();
    }

    private getProcessLogLevel(): LogLevel {
        const processLogLevel = process.env.LOG_LEVEL;

        if (!processLogLevel) {
            return DEFAULT_LOG_LEVEL;
        }

        if (!LOG_LEVEL.includes(processLogLevel as LogLevel)) {
            return DEFAULT_LOG_LEVEL;
        }

        return processLogLevel as LogLevel;
    }

    private buildPriorityCache(): Record<LogLevel, number> {
        const cache: Partial<Record<LogLevel, number>> = {};
        LOG_PRIORITY.forEach((levels, index) => {
            levels.forEach((level) => {
                cache[level] = index;
            });
        });
        return cache as Record<LogLevel, number>;
    }

    logLevelPriority(level: LogLevel): number {
        return this.priorityCache[level] ?? Number.MAX_SAFE_INTEGER;
    }

    isLogLevelEnabled(currentLevel: LogLevel, targetLevel: LogLevel): boolean {
        const currentPriority = this.logLevelPriority(currentLevel);
        const targetPriority = this.logLevelPriority(targetLevel);
        return (
            currentPriority < Number.MAX_SAFE_INTEGER &&
            targetPriority < Number.MAX_SAFE_INTEGER &&
            targetPriority <= currentPriority
        );
    }

    getLogLevel(): LogLevel {
        return this.level;
    }
}
