/**
 * @license Apache-2.0
 *
 * Custom error for string-format
 */

/**
 * ValueError - Error thrown when format string is invalid
 */
export class ValueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValueError';
        Object.setPrototypeOf(this, ValueError.prototype);
    }
}
