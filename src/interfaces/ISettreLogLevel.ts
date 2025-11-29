import type { LogLevel } from '../types/LogLevel';

export interface ISetterLogLevel {
    /**
     * Set log levels.
     * @param levels log levels
     */
    setLogLevel(level: LogLevel): void;
}
