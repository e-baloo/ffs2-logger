/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

/**
 * Token object representing a format specifier
 */
export interface FormatToken {
    /** Format specifier (b, o, x, X, d, i, u, s, c, e, E, f, F, g, G) */
    specifier: string;
    /** Precision for number formatting */
    precision?: number | string;
    /** Width for padding */
    width?: number | string;
    /** Format flags (space, +, -, 0, #) */
    flags?: string;
    /** Argument mapping position */
    mapping?: number;
    /** Sign character ('+' or ' ') */
    sign?: string;
    /** Pad to the right instead of left */
    padRight?: boolean;
    /** Pad with zeros */
    padZeros?: boolean;
    /** Use alternate form */
    alternate?: boolean;
    /** Argument value to format */
    arg?: any;
    /** Maximum width for string truncation */
    maxWidth?: number;
}

/**
 * Token array element - either a string or a format token
 */
export type Token = string | FormatToken;
