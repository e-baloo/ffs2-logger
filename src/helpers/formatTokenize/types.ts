/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-tokenize
 */

/**
 * Format token object representing a parsed format specifier
 */
export interface FormatToken {
    /** Argument mapping position (1-indexed) */
    mapping?: number;
    /** Format flags (0, +, -, space, #) */
    flags: string;
    /** Width for padding (* or number string) */
    width?: string;
    /** Precision (* or number string) */
    precision?: string;
    /** Format specifier character */
    specifier: string;
}

/**
 * Token - either a string literal or a format token object
 */
export type Token = string | FormatToken;
