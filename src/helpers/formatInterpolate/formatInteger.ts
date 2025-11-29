/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

import { isNumber } from './isNumber';
import type { FormatToken } from './types';
import { zeroPad } from './zeroPad';

/**
 * Formats a token object argument as an integer.
 *
 * @param token - token object
 * @throws Error if must provide a valid integer
 * @returns formatted token argument
 */
export function formatInteger(token: FormatToken): string {
    let base: number;

    switch (token.specifier) {
        case 'b':
            // Case: %b (binary)
            base = 2;
            break;
        case 'o':
            // Case: %o (octal)
            base = 8;
            break;
        case 'x':
        case 'X':
            // Case: %x, %X (hexadecimal)
            base = 16;
            break;
        // case 'd':
        // case 'i':
        // case 'u':
        default:
            // Case: %d, %i, %u (decimal)
            base = 10;
            break;
    }

    let out = token.arg;
    let i = Number.parseInt(out, 10);

    if (!Number.isFinite(i)) {
        if (!isNumber(out)) {
            throw new Error(`invalid integer. Value: ${out}`);
        }
        i = 0;
    }

    if (i < 0 && (token.specifier === 'u' || base !== 10)) {
        i = 0xffffffff + i + 1;
    }

    if (i < 0) {
        out = (-i).toString(base);
        if (token.precision) {
            out = zeroPad(out, token.precision as number, token.padRight);
        }
        out = `-${out}`;
    } else {
        out = i.toString(base);
        if (!i && !token.precision) {
            out = '';
        } else if (token.precision) {
            out = zeroPad(out, token.precision as number, token.padRight);
        }
        if (token.sign) {
            out = token.sign + out;
        }
    }

    if (base === 16) {
        if (token.alternate) {
            out = `0x${out}`;
        }
        out = token.specifier === token.specifier.toUpperCase() ? out.toUpperCase() : out.toLowerCase();
    }

    if (base === 8) {
        if (token.alternate && out.charAt(0) !== '0') {
            out = `0${out}`;
        }
    }

    return out;
}
