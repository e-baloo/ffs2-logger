/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

import { formatDouble } from './formatDouble';
import { formatInteger } from './formatInteger';
import { isNumber } from './isNumber';
import { isString } from './isString';
import { spacePad } from './spacePad';
import type { FormatToken, Token } from './types';
import { zeroPad } from './zeroPad';

/**
 * Returns a boolean indicating whether a value is `NaN`.
 */
function isnan(value: unknown): boolean {
    // biome-ignore lint/suspicious/noSelfCompare: use self comparison to check for NaN
    return value !== value;
}

/**
 * Initializes token object with properties of supplied format identifier object
 * or default values if not present.
 */
function initialize(token: FormatToken): FormatToken {
    const out: FormatToken = {
        specifier: token.specifier,
        precision: token.precision === undefined ? 1 : token.precision,
        flags: token.flags || '',
    };

    // Add optional properties only if they exist
    if (token.width !== undefined) {
        out.width = token.width;
    }

    if (token.mapping !== undefined) {
        out.mapping = token.mapping;
    }

    return out;
}

/**
 * Generates string from a token array by interpolating values.
 *
 * @param tokens - string parts and format identifier objects
 * @param args - variable values
 * @throws TypeError if first argument is not an array
 * @throws Error if invalid flags
 * @returns formatted string
 *
 * @example
 * const tokens = ['beep ', { specifier: 's' }];
 * const out = formatInterpolate(tokens, 'boop');
 * // returns 'beep boop'
 */

// biome-ignore lint/suspicious/noExplicitAny: use any for flexibility
export function formatInterpolate(tokens: Token[], ...args: any[]): string {
    if (!Array.isArray(tokens)) {
        throw new TypeError(`invalid argument. First argument must be an array. Value: \`${tokens}\`.`);
    }

    let out = '';
    let pos = 0; // Changed from 1 to 0 since args is zero-indexed

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (isString(token)) {
            out += token;
        } else if (token) {
            const hasPeriod = token.precision !== undefined;
            token = initialize(token);

            if (!token.specifier) {
                throw new TypeError(
                    `invalid argument. Token is missing \`specifier\` property. Index: \`${i}\`. Value: \`${token}\`.`
                );
            }

            if (token.mapping) {
                pos = token.mapping;
            }

            const flags = token.flags || '';
            for (let j = 0; j < flags.length; j++) {
                const flag = flags.charAt(j);
                switch (flag) {
                    case ' ':
                        token.sign = ' ';
                        break;
                    case '+':
                        token.sign = '+';
                        break;
                    case '-':
                        token.padRight = true;
                        token.padZeros = false;
                        break;
                    case '0':
                        token.padZeros = flags.indexOf('-') < 0;
                        break;
                    case '#':
                        token.alternate = true;
                        break;
                    default:
                        throw new Error(`invalid flag: ${flag}`);
                }
            }

            if (token.width === '*') {
                token.width = Number.parseInt(args[pos], 10);
                pos += 1;
                if (isnan(token.width)) {
                    throw new TypeError(
                        `the argument for * width at position ${pos} is not a number. Value: \`${token.width}\`.`
                    );
                }
                if ((token.width as number) < 0) {
                    token.padRight = true;
                    token.width = -(token.width as number);
                }
            }

            if (hasPeriod) {
                if (token.precision === '*') {
                    token.precision = Number.parseInt(args[pos], 10);
                    pos += 1;
                    if (isnan(token.precision)) {
                        throw new TypeError(
                            `the argument for * precision at position ${pos} is not a number. Value: \`${token.precision}\`.`
                        );
                    }
                    if ((token.precision as number) < 0) {
                        token.precision = 1;
                    }
                }
            }

            token.arg = args[pos];

            switch (token.specifier) {
                case 'b':
                case 'o':
                case 'x':
                case 'X':
                case 'd':
                case 'i':
                case 'u':
                    // Case: %b (binary), %o (octal), %x, %X (hexadecimal), %d, %i (decimal), %u (unsigned decimal)
                    if (hasPeriod) {
                        token.padZeros = false;
                    }
                    token.arg = formatInteger(token);
                    break;
                case 's':
                    // Case: %s (string)
                    token.maxWidth = hasPeriod ? (token.precision as number) : -1;
                    token.arg = String(token.arg);
                    break;
                case 'c': {
                    // Case: %c (character)
                    if (!isnan(token.arg)) {
                        const num = Number.parseInt(token.arg, 10);
                        if (num < 0 || num > 127) {
                            throw new Error(`invalid character code. Value: ${token.arg}`);
                        }
                        token.arg = isnan(num) ? String(token.arg) : String.fromCharCode(num);
                    }
                    break;
                }
                case 'e':
                case 'E':
                case 'f':
                case 'F':
                case 'g':
                case 'G': {
                    // Case: %e, %E (scientific notation), %f, %F (decimal floating point), %g, %G (uses the shorter of %e/E or %f/F)
                    if (!hasPeriod) {
                        token.precision = 6;
                    }
                    const floatValue = Number.parseFloat(token.arg);
                    if (!Number.isFinite(floatValue)) {
                        if (!isNumber(token.arg)) {
                            throw new Error(`invalid floating-point number. Value: ${token.arg}`);
                        }
                        // Case: NaN, Infinity, or -Infinity
                        token.arg = formatDouble(token.arg, token);
                        token.padZeros = false;
                    } else {
                        token.arg = formatDouble(floatValue, token);
                    }
                    break;
                }
                default:
                    throw new Error(`invalid specifier: ${token.specifier}`);
            } // Fit argument into field width...
            if (token.maxWidth !== undefined && token.maxWidth >= 0 && token.arg.length > token.maxWidth) {
                token.arg = token.arg.substring(0, token.maxWidth);
            }

            if (token.padZeros) {
                token.arg = zeroPad(token.arg, (token.width as number) || (token.precision as number), token.padRight);
            } else if (token.width) {
                token.arg = spacePad(token.arg, token.width as number, token.padRight);
            }

            out += token.arg || '';
            pos += 1;
        } else {
            throw new TypeError(`invalid token at index ${i}: token is undefined`);
        }
    }

    return out;
}
