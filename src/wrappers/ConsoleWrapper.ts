import type { ILogger } from '../interfaces/ILogger';

/**
 * Sauvegarde des méthodes console originales
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
 * Wrapper pour intercepter tous les appels à console et les rediriger vers le logger
 * Permet de capturer tous les console.log, console.error, etc. dans l'application
 * et de les gérer via le système de logging unifié
 */
export class ConsoleWrapper {
    private static originalMethods: OriginalConsoleMethods | null = null;
    private static isWrapped = false;

    /**
     * Active l'interception de la console
     * @param logger - Logger vers lequel rediriger les appels console
     * @param context - Contexte optionnel pour tous les logs console (par défaut: 'Console')
     */
    static wrap(logger: ILogger, context: string = 'Console'): void {
        if (this.isWrapped) {
            return;
        }

        // Sauvegarde des méthodes originales
        this.originalMethods = {
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

        this.isWrapped = true;
    }

    /**
     * Désactive l'interception de la console et restaure les méthodes originales
     */
    static unwrap(): void {
        if (!this.isWrapped || !this.originalMethods) {
            return;
        }

        console.log = this.originalMethods.log;
        console.info = this.originalMethods.info;
        console.warn = this.originalMethods.warn;
        console.error = this.originalMethods.error;
        console.debug = this.originalMethods.debug;
        console.trace = this.originalMethods.trace;

        this.originalMethods = null;
        this.isWrapped = false;
    }

    /**
     * Vérifie si la console est actuellement wrappée
     */
    static isConsoleWrapped(): boolean {
        return this.isWrapped;
    }

    /**
     * Accède aux méthodes console originales (utile pour le debug du logger lui-même)
     */
    static getOriginalConsole(): OriginalConsoleMethods | null {
        return this.originalMethods;
    }
}
