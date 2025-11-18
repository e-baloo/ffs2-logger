/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

/**
 * Returns `n` spaces.
 */
function spaces(n: number): string {
    let out = '';
    for (let i = 0; i < n; i++) {
        out += ' ';
    }
    return out;
}

/**
 * Pads a token with spaces to the specified width.
 *
 * @param str - token argument
 * @param width - token width
 * @param right - boolean indicating whether to pad to the right
 * @returns padded token argument
 */
export function spacePad(str: string, width: number, right = false): string {
    const pad = width - str.length;

    if (pad < 0) {
        return str;
    }

    str = right ? str + spaces(pad) : spaces(pad) + str;

    return str;
}
