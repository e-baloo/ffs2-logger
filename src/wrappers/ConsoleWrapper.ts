/** biome-ignore-all lint/complexity/noStaticOnlyClass: wrapper form console */
/** biome-ignore-all lint/suspicious/noExplicitAny: compatibility with console */
import type { ILogger } from '../interfaces/ILogger';

/**
 * Backup of original console methods
 */
interface OriginalConsoleMethods {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
    trace: typeof console.trace;
}

/**
 * Wrapper to intercept all console calls and redirect them to the logger
 * Allows capturing all console.log, console.error, etc. in the application
 * and handling them via the unified logging system
 */
export class ConsoleWrapper {
    private static originalMethods: OriginalConsoleMethods | null = null;
    private static isWrapped = false;

    /**
     * Enables console interception
     * @param logger - Logger to redirect console calls to
     * @param context - Optional context for all console logs (default: 'Console')
     */
    static wrap(logger: ILogger, context: string = 'Console'): void {
        if (ConsoleWrapper.isWrapped) {
            return;
        }

        // Backup original methods
        ConsoleWrapper.originalMethods = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error,
            debug: console.debug,
            trace: console.trace,
        };

        // Override console.log
        console.log = (...args: any[]): void => {
            const data = args.slice(1);
            logger.log({ message: args[0], context, data: data.length > 0 ? data : undefined });
        };

        // Override console.info
        console.info = (...args: any[]): void => {
            const data = args.slice(1);
            logger.info({ message: args[0], context, data: data.length > 0 ? data : undefined });
        };

        // Override console.warn
        console.warn = (...args: any[]): void => {
            const data = args.slice(1);
            logger.warn({ message: args[0], context, data: data.length > 0 ? data : undefined });
        };

        // Override console.error
        console.error = (...args: any[]): void => {
            const data = args.slice(1);
            if (args[0] instanceof Error) {
                logger.error({ context, error: args[0], data: data.length > 0 ? data : undefined });
            } else {
                logger.error({ message: args[0], context, data: data.length > 0 ? data : undefined });
            }
        };

        // Override console.debug
        console.debug = (...args: any[]): void => {
            const data = args.slice(1);
            logger.debug({ message: args[0], context, data: data.length > 0 ? data : undefined });
        };

        // Override console.trace
        console.trace = (...args: any[]): void => {
            // const message = format(args[0], ...args.slice(1));
            const error = new Error('Trace');
            logger.trace({ message: args[0], context, error, data: args.slice(1) });
        };

        ConsoleWrapper.isWrapped = true;
    }

    /**
     * Disables console interception and restores original methods
     */
    static unwrap(): void {
        if (!ConsoleWrapper.isWrapped || !ConsoleWrapper.originalMethods) {
            return;
        }

        console.log = ConsoleWrapper.originalMethods.log;
        console.info = ConsoleWrapper.originalMethods.info;
        console.warn = ConsoleWrapper.originalMethods.warn;
        console.error = ConsoleWrapper.originalMethods.error;
        console.debug = ConsoleWrapper.originalMethods.debug;
        console.trace = ConsoleWrapper.originalMethods.trace;

        ConsoleWrapper.originalMethods = null;
        ConsoleWrapper.isWrapped = false;
    }

    /**
     * Checks if the console is currently wrapped
     */
    static isConsoleWrapped(): boolean {
        return ConsoleWrapper.isWrapped;
    }

    /**
     * Accesses original console methods (useful for debugging the logger itself)
     */
    static getOriginalConsole(): OriginalConsoleMethods | null {
        return ConsoleWrapper.originalMethods;
    }
}
