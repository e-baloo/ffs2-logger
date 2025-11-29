/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

import type { FormatToken } from './types';

const RE_EXP_POS_DIGITS = /e\+(\d)$/;
const RE_EXP_NEG_DIGITS = /e-(\d)$/;
const RE_ONLY_DIGITS = /^(\d+)$/;
const RE_DIGITS_BEFORE_EXP = /^(\d+)e/;
const RE_TRAILING_PERIOD_ZERO = /\.0$/;
const RE_PERIOD_ZERO_EXP = /\.0*e/;
const RE_ZERO_BEFORE_EXP = /(\..*[^0])0*e/;

/**
 * Formats a token object argument as a floating-point number.
 *
 * @param f - parsed number
 * @param token - token object
 * @throws Error if must provide a valid floating-point number
 * @returns formatted token argument
 */
export function formatDouble(f: number, token: FormatToken): string {
    let digits: number;
    let out: string;

    switch (token.specifier) {
        case 'e':
        case 'E':
            out = f.toExponential(token.precision as number);
            break;
        case 'f':
        case 'F':
            out = f.toFixed(token.precision as number);
            break;
        case 'g':
        case 'G':
            if (Math.abs(f) < 0.0001) {
                digits = token.precision as number;
                if (digits > 0) {
                    digits -= 1;
                }
                out = f.toExponential(digits);
            } else {
                out = f.toPrecision(token.precision as number);
            }
            if (!token.alternate) {
                out = out.replace(RE_ZERO_BEFORE_EXP, '$1e');
                out = out.replace(RE_PERIOD_ZERO_EXP, 'e');
                out = out.replace(RE_TRAILING_PERIOD_ZERO, '');
            }
            break;
        default:
            throw new Error(`invalid double notation. Value: ${token.specifier}`);
    }

    out = out.replace(RE_EXP_POS_DIGITS, 'e+0$1');
    out = out.replace(RE_EXP_NEG_DIGITS, 'e-0$1');

    if (token.alternate) {
        out = out.replace(RE_ONLY_DIGITS, '$1.');
        out = out.replace(RE_DIGITS_BEFORE_EXP, '$1.e');
    }

    if (f >= 0 && token.sign) {
        out = token.sign + out;
    }

    out = token.specifier === token.specifier.toUpperCase() ? out.toUpperCase() : out.toLowerCase();

    return out;
}
