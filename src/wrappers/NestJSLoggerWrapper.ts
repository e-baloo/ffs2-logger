import type { ILogger } from '../interfaces/ILogger';
import type { LogMessage } from '../types/LogMessage';

/**
 * Interface LoggerService de NestJS
 * Réplique l'interface officielle pour éviter la dépendance à @nestjs/common
 */
// biome-ignore lint/suspicious/noExplicitAny: Interface NestJS compatible
export interface LoggerService {
    log(message: any, ...optionalParams: any[]): any;
    error(message: any, ...optionalParams: any[]): any;
    warn(message: any, ...optionalParams: any[]): any;
    debug?(message: any, ...optionalParams: any[]): any;
    verbose?(message: any, ...optionalParams: any[]): any;
    fatal?(message: any, ...optionalParams: any[]): any;
}

/**
 * Wrapper pour intégrer un Logger FFS2 avec l'interface LoggerService de NestJS
 * Permet d'utiliser le système de logging FFS2 dans une application NestJS
 */
export class NestJSLoggerWrapper implements LoggerService {
    /**
     * @param logger - Instance du logger FFS2 à wrapper
     * @param context - Contexte optionnel pour tous les logs (ex: nom du module)
     */
    constructor(
        private readonly logger: ILogger,
        private context?: string
    ) {}

    /**
     * Définit ou modifie le contexte du logger
     * @param context - Nouveau contexte à utiliser
     */
    setContext(context: string): void {
        this.context = context;
    }

    /**
     * Obtient le contexte actuel du logger
     */
    getContext(): string | undefined {
        return this.context;
    }

    /**
     * Log de niveau info (méthode principale de NestJS)
     * @param message - Message à logger
     * @param context - Contexte optionnel qui override le contexte par défaut
     */
    log(message: LogMessage, context?: string): void {
        this.logger.info(this.formatMessage(message, context));
    }

    /**
     * Log d'erreur
     * @param message - Message d'erreur
     * @param trace - Stack trace optionnelle
     * @param context - Contexte optionnel
     */
    error(message: LogMessage, trace?: string, context?: string): void {
        const formattedMessage = this.formatMessage(message, context);

        if (trace) {
            this.logger.error({
                message: formattedMessage,
                error: new Error(trace),
            });
        } else {
            this.logger.error(formattedMessage);
        }
    }

    /**
     * Log de warning
     * @param message - Message d'avertissement
     * @param context - Contexte optionnel
     */
    warn(message: LogMessage, context?: string): void {
        this.logger.warn(this.formatMessage(message, context));
    }

    /**
     * Log de debug
     * @param message - Message de debug
     * @param context - Contexte optionnel
     */
    debug(message: LogMessage, context?: string): void {
        this.logger.debug(this.formatMessage(message, context));
    }

    /**
     * Log verbose
     * @param message - Message verbose
     * @param context - Contexte optionnel
     */
    verbose(message: LogMessage, context?: string): void {
        this.logger.verbose(this.formatMessage(message, context));
    }

    /**
     * Log fatal (extension de l'interface standard NestJS)
     * @param message - Message fatal
     * @param context - Contexte optionnel
     */
    fatal(message: LogMessage, context?: string): void {
        this.logger.fatal(this.formatMessage(message, context));
    }

    /**
     * Formate le message en ajoutant le contexte si nécessaire
     * @param message - Message original
     * @param context - Contexte spécifique ou utilise le contexte par défaut
     * @returns Message formaté avec contexte
     */
    private formatMessage(message: LogMessage, context?: string): LogMessage {
        const finalContext = context || this.context;

        if (!finalContext) {
            return message;
        }

        // Si le message est une string, ajouter le contexte en préfixe
        if (typeof message === 'string') {
            return `[${finalContext}] ${message}`;
        }

        // Si le message est un objet, ajouter le contexte en propriété
        if (typeof message === 'object' && message !== null) {
            return {
                ...message,
                context: finalContext,
            };
        }

        return message;
    }
}
