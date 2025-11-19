import type { IConsoleJsonFormatter } from '../../interfaces/console/IConsoleJsonFormatter';
import type { LogEvent } from '../../types/LogEvent';

/**
 * Formatter JSON pour les logs console
 * Formate les événements de log en JSON structuré
 */
export class ConsoleJsonFormatter implements IConsoleJsonFormatter {
    private compact: boolean;

    constructor(compact = false) {
        this.compact = compact;
    }

    getTemplate(): string {
        return '';
    }

    setTemplate(_template: string): void {}

    setCompact(compact: boolean): void {
        this.compact = compact;
    }

    getCompact(): boolean {
        return this.compact;
    }

    formatEvent(event: LogEvent): [string, string | null, string | null] {
        const jsonData: Record<string, unknown> = {
            timestamp: new Date(event.timestamp || Date.now()).toISOString(),
            level: event.level.toUpperCase(),
            message: event.message,
        };

        // Ajouter le contexte si présent
        if (event.context) {
            jsonData.context = event.context;
        }

        // Ajouter les données si présentes
        if (event.data) {
            jsonData.data = event.data;
        }

        // Ajouter l'erreur si présente
        if (event.error) {
            jsonData.error = {
                message: event.error.message,
                stack: event.error.stack,
                name: event.error.name,
            };
        }

        // Formater en JSON
        const jsonString = this.compact ? JSON.stringify(jsonData) : JSON.stringify(jsonData, null, 2);

        return [jsonString, null, null];
    }
}
