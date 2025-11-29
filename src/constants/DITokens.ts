import type { IEmojiFormatter } from '../appenders/EmojiFormatter';
import type { IConsoleColorized } from '../interfaces/console/IConsoleColorized';
import type { IConsoleFormatter } from '../interfaces/console/IConsoleFormatter';
import type { IConsoleJsonFormatter } from '../interfaces/console/IConsoleJsonFormatter';
import type { IConsolePrinter } from '../interfaces/console/IConsolePrinter';
import { InjectionToken } from '../interfaces/di/InjectionToken';
import type { ITemplateProvider } from '../interfaces/ITemplateProvider';

/**
 * Injection tokens for ConsoleAppender dependencies
 * These tokens serve as keys to register and resolve services in the DI Container
 */

/**
 * Token for the console colorization service
 */
export const CONSOLE_COLORIZED_TOKEN = new InjectionToken<IConsoleColorized>('IConsoleColorized');

/**
 * Token for the console formatting service
 */
export const CONSOLE_FORMATTER_TOKEN = new InjectionToken<IConsoleFormatter>('IConsoleFormatter');

/**
 * Token for the console JSON formatter
 */
export const CONSOLE_JSON_FORMATTER_TOKEN = new InjectionToken<IConsoleJsonFormatter>('IConsoleJsonFormatter');

/**
 * Token for the console printing service
 */
export const CONSOLE_PRINTER_TOKEN = new InjectionToken<IConsolePrinter>('IConsolePrinter');

/**
 * Token for the template provider
 */
export const TEMPLATE_PROVIDER_TOKEN = new InjectionToken<ITemplateProvider>('ITemplateProvider');

/**
 * Token for the emoji formatter
 */
export const EMOJI_FORMATTER_TOKEN = new InjectionToken<IEmojiFormatter>('IEmojiFormatter');
