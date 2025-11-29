/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

/**
 * Tests if a string starts with a minus sign (`-`).
 */
function startsWithMinus(str: string): boolean {
    return str[0] === '-';
}

/**
 * Returns a string of `n` zeros.
 */
function zeros(n: number): string {
    let out = '';
    for (let i = 0; i < n; i++) {
        out += '0';
    }
    return out;
}

/**
 * Pads a token with zeros to the specified width.
 *
 * @param str - token argument
 * @param width - token width
 * @param right - boolean indicating whether to pad to the right
 * @returns padded token argument
 */
export function zeroPad(str: string, width: number, right = false): string {
    let negative = false;
    const pad = width - str.length;

    if (pad < 0) {
        return str;
    }

    if (startsWithMinus(str)) {
        negative = true;
        str = str.substring(1);
    }

    str = right ? str + zeros(pad) : zeros(pad) + str;

    if (negative) {
        str = `-${str}`;
    }

    return str;
}
