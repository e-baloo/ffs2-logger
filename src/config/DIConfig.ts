import { ConsoleColorized } from '../appenders/console/ConsoleColorized';
import { ConsoleFormatter } from '../appenders/console/ConsoleFormatter';
import { ConsolePrinter } from '../appenders/console/ConsolePrinter';
import {
    CONSOLE_COLORIZED_TOKEN,
    CONSOLE_FORMATTER_TOKEN,
    CONSOLE_PRINTER_TOKEN,
    TEMPLATE_PROVIDER_TOKEN,
} from '../constants/DITokens';
import { TemplateProvider } from '../providers/TemplateProvider';
import { DIContainer } from '../services/DIContainer';

/**
 * Conteneur DI global pour l'application
 * Pré-configuré avec les dépendances par défaut de ConsoleAppender
 */
export const globalContainer = new DIContainer();

/**
 * Configure le conteneur avec les providers par défaut
 * Tous les services sont enregistrés en tant que singletons pour optimiser les performances
 */
export function configureDefaultContainer(): void {
    // Service de colorisation - Singleton
    globalContainer.register({
        token: CONSOLE_COLORIZED_TOKEN,
        useFactory: () => new ConsoleColorized(),
        singleton: true,
    });

    // Provider de template - Singleton
    globalContainer.register({
        token: TEMPLATE_PROVIDER_TOKEN,
        useFactory: () => new TemplateProvider(),
        singleton: true,
    });

    // Service de formatage - Singleton (dépend de colorized et templateProvider)
    globalContainer.register({
        token: CONSOLE_FORMATTER_TOKEN,
        useFactory: () =>
            new ConsoleFormatter(
                globalContainer.resolve(CONSOLE_COLORIZED_TOKEN),
                globalContainer.resolve(TEMPLATE_PROVIDER_TOKEN)
            ),
        singleton: true,
    });

    // Service d'impression - Singleton
    globalContainer.register({
        token: CONSOLE_PRINTER_TOKEN,
        useFactory: () => new ConsolePrinter(),
        singleton: true,
    });
}

// Configuration automatique au chargement du module
configureDefaultContainer();
