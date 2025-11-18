/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-tokenize
 */

import type { FormatToken, Token } from './types';

/**
 * Regular expression to match format specifiers
 * Pattern: %[position$][flags][width][.precision][length]specifier
 * - position: optional 1-indexed argument position (e.g., 1$, 2$)
 * - flags: zero or more of: 0, +, -, space, #
 * - width: optional field width (* or digits)
 * - precision: optional precision preceded by . (* or digits)
 * - length: optional length modifier (h, l, L) - ignored
 * - specifier: required format specifier character
 */
const RE = /%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;

/**
 * Parses a delimiter match into a format token object.
 *
 * @param match - regular expression match array
 * @returns delimiter token object
 */
function parse(match: RegExpExecArray): FormatToken {
    const token: FormatToken = {
        mapping: match[1] ? Number.parseInt(match[1], 10) : undefined,
        flags: match[2],
        width: match[3],
        precision: match[5],
        specifier: match[6],
    };

    // Special case: .* or . with no precision specified means precision of 1
    if (match[4] === '.' && match[5] === undefined) {
        token.precision = '1';
    }

    return token;
}

/**
 * Tokenizes a string into an array of string parts and format identifier objects.
 *
 * @param str - input string with format specifiers
 * @returns array of tokens (string literals and format objects)
 *
 * @example
 * const tokens = formatTokenize('Hello %s!');
 * // returns ['Hello ', { flags: '', specifier: 's', ... }, '!']
 *
 * @example
 * const tokens = formatTokenize('Value: %d, Hex: %#x');
 * // returns ['Value: ', {...}, ', Hex: ', {...}]
 *
 * @example
 * const tokens = formatTokenize('Escaped: %%');
 * // returns ['Escaped: ', '%']
 */
export function formatTokenize(str: string): Token[] {
    const tokens: Token[] = [];
    let prev = 0;

    // Reset lastIndex to ensure regex starts from beginning
    RE.lastIndex = 0;

    let match = RE.exec(str);

    while (match) {
        // Get content between previous position and current match
        const content = str.slice(prev, RE.lastIndex - match[0].length);

        if (content.length) {
            tokens.push(content);
        }

        // Check for an escaped percent sign `%%`
        if (match[6] === '%') {
            tokens.push('%');
        } else {
            tokens.push(parse(match));
        }

        prev = RE.lastIndex;
        match = RE.exec(str);
    }

    // Add remaining content after last match
    const content = str.slice(prev);
    if (content.length) {
        tokens.push(content);
    }

    return tokens;
}
