/**
 * @license Apache-2.0
 *
 * Complete printf-style string formatting utility
 */

import { formatInterpolate } from './formatInterpolate';
import { formatTokenize } from './formatTokenize';

/**
 * Formats a string using printf-style format specifiers.
 *
 * This is a convenience wrapper that combines formatTokenize and formatInterpolate
 * into a single function call for easier usage.
 *
 * @param formatString - string with format specifiers
 * @param args - values to interpolate
 * @returns formatted string
 *
 * @example
 * format('Hello %s!', 'World');
 * // => 'Hello World!'
 *
 * @example
 * format('Name: %s, Age: %d', 'Alice', 30);
 * // => 'Name: Alice, Age: 30'
 *
 * @example
 * format('Pi: %.2f', 3.14159);
 * // => 'Pi: 3.14'
 *
 * @example
 * format('[%05d]', 42);
 * // => '[00042]'
 */

// biome-ignore lint/suspicious/noExplicitAny: use any for flexibility
export function format(formatString: string, ...args: any[]): string {
    const tokens = formatTokenize(formatString);
    return formatInterpolate(tokens, ...args);
}
