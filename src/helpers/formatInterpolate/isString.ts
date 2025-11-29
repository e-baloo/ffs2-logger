/**
 * @license Apache-2.0
 * Converted to TypeScript from stdlib-js/string-base-format-interpolate
 */

/**
 * Tests if a value is a string primitive.
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}
