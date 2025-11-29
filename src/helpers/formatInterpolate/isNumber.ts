/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

/**
 * Tests if a value is a number primitive.
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}
