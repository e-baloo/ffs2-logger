import { ConsoleColorized } from '../appenders/console/ConsoleColorized';
import { ConsoleFormatter } from '../appenders/console/ConsoleFormatter';
import { ConsoleJsonFormatter } from '../appenders/console/ConsoleJsonFormatter';
import { ConsolePrinter } from '../appenders/console/ConsolePrinter';
import { EmojiFormatter } from '../appenders/EmojiFormatter';
import {
    CONSOLE_COLORIZED_TOKEN,
    CONSOLE_FORMATTER_TOKEN,
    CONSOLE_JSON_FORMATTER_TOKEN,
    CONSOLE_PRINTER_TOKEN,
    EMOJI_FORMATTER_TOKEN,
    TEMPLATE_PROVIDER_TOKEN,
} from '../constants/DITokens';
import { TemplateProvider } from '../providers/TemplateProvider';
import { DIContainer } from '../services/DIContainer';

/**
 * Global DI Container for the application
 * Pre-configured with default ConsoleAppender dependencies
 */
export const globalContainer = new DIContainer();

/**
 * Configures the container with default providers
 * All services are registered as singletons to optimize performance
 */
export function configureDefaultContainer(): void {
    // Colorization Service - Singleton
    globalContainer.register({
        token: CONSOLE_COLORIZED_TOKEN,
        useFactory: () => new ConsoleColorized(),
        singleton: true,
    });

    // Template Provider - Singleton
    globalContainer.register({
        token: TEMPLATE_PROVIDER_TOKEN,
        useFactory: () => new TemplateProvider(),
        singleton: true,
    });

    // Formatting Service - Singleton (depends on colorized and templateProvider)
    globalContainer.register({
        token: CONSOLE_FORMATTER_TOKEN,
        useFactory: () =>
            new ConsoleFormatter(
                globalContainer.resolve(CONSOLE_COLORIZED_TOKEN),
                globalContainer.resolve(TEMPLATE_PROVIDER_TOKEN)
            ),
        singleton: true,
    });

    // JSON Formatting Service - Singleton
    globalContainer.register({
        token: CONSOLE_JSON_FORMATTER_TOKEN,
        useFactory: () => new ConsoleJsonFormatter(),
        singleton: true,
    });

    // Emoji Formatting Service - Singleton
    globalContainer.register({
        token: EMOJI_FORMATTER_TOKEN,
        useFactory: () => new EmojiFormatter(),
        singleton: true,
    });

    // Printing Service - Singleton
    globalContainer.register({
        token: CONSOLE_PRINTER_TOKEN,
        useFactory: () => new ConsolePrinter(),
        singleton: true,
    });
}

// Automatic configuration on module load
configureDefaultContainer();
