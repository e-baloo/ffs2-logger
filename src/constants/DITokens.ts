import type { IConsoleColorized } from '../interfaces/console/IConsoleColorized';
import type { IConsoleFormatter } from '../interfaces/console/IConsoleFormatter';
import { IConsoleJsonFormatter } from '../interfaces/console/IConsoleJsonFormatter';
import type { IConsolePrinter } from '../interfaces/console/IConsolePrinter';
import { InjectionToken } from '../interfaces/di/InjectionToken';
import type { ITemplateProvider } from '../interfaces/ITemplateProvider';
import type { IEmojiFormatter } from '../appenders/EmojiFormatter';

/**
 * Tokens d'injection pour les dépendances de ConsoleAppender
 * Ces tokens servent de clés pour enregistrer et résoudre les services dans le DI Container
 */

/**
 * Token pour le service de colorisation de console
 */
export const CONSOLE_COLORIZED_TOKEN = new InjectionToken<IConsoleColorized>('IConsoleColorized');

/**
 * Token pour le service de formatage de console
 */
export const CONSOLE_FORMATTER_TOKEN = new InjectionToken<IConsoleFormatter>('IConsoleFormatter');

/**
 * Token pour le formatter JSON de console
 */
export const CONSOLE_JSON_FORMATTER_TOKEN = new InjectionToken<IConsoleJsonFormatter>('IConsoleJsonFormatter');

/**
 * Token pour le service d'impression console
 */
export const CONSOLE_PRINTER_TOKEN = new InjectionToken<IConsolePrinter>('IConsolePrinter');

/**
 * Token pour le provider de template
 */
export const TEMPLATE_PROVIDER_TOKEN = new InjectionToken<ITemplateProvider>('ITemplateProvider');

/**
 * Token pour le formatter d'emoji
 */
export const EMOJI_FORMATTER_TOKEN = new InjectionToken<IEmojiFormatter>('IEmojiFormatter');
