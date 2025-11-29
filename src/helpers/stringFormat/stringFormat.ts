/**
 * @license Apache-2.0
 *
 * String formatting with Python-style placeholders
 * Based on davidchambers/string-format
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: use any for flexibility */

import type { FormatFunction, Transformers } from './types';
import { ValueError } from './ValueError';

/**
 * Creates a format function with custom transformers
 *
 * @param transformers - Object mapping transformer names to functions
 * @returns Format function that can be used to format strings
 *
 * @example
 * const fmt = create({
 *   upper: s => s.toUpperCase(),
 *   escape: s => s.replace(/[&<>"'`]/g, c => '&#' + c.charCodeAt(0) + ';')
 * });
 * fmt('Hello, {!upper}!', 'alice'); // => 'Hello, ALICE!'
 */
export function create(transformers: Transformers): FormatFunction {
    return (template: string, ...args: any[]): string => {
        let idx = 0;
        let state: 'UNDEFINED' | 'IMPLICIT' | 'EXPLICIT' = 'UNDEFINED';

        return template.replace(
            /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
            (_match: string, literal: string | undefined, _key: string, xf: string | undefined): string => {
                // Handle escaped braces {{ and }}
                if (literal !== null && literal !== undefined) {
                    return literal;
                }

                let key = _key;

                // Determine if using implicit or explicit numbering
                if (key.length > 0) {
                    if (state === 'IMPLICIT') {
                        throw new ValueError('cannot switch from implicit to explicit numbering');
                    }
                    state = 'EXPLICIT';
                } else {
                    if (state === 'EXPLICIT') {
                        throw new ValueError('cannot switch from explicit to implicit numbering');
                    }
                    state = 'IMPLICIT';
                    key = String(idx);
                    idx += 1;
                }

                // Split key into lookup path
                const path = key.split('.');

                // If first component is not a number, prepend '0'
                const lookupPath = path.length > 0 && path[0] && /^\d+$/.test(path[0]) ? path : ['0'].concat(path);

                // Resolve the value by following the path
                const value = lookupPath
                    .reduce(
                        (maybe: any[], currentKey: string): any[] => {
                            return maybe.reduce((_: any, x: any): any[] => {
                                if (x !== null && x !== undefined && currentKey in Object(x)) {
                                    const val = x[currentKey];
                                    // Invoke if it's a function
                                    return [typeof val === 'function' ? val.call(x) : val];
                                }
                                return [];
                            }, []);
                        },
                        [args]
                    )
                    .reduce((_: any, x: any): any => x, '');

                // Apply transformer if specified
                if (xf === null || xf === undefined) {
                    return value;
                }
                if (Object.hasOwn(transformers, xf)) {
                    const transformer = transformers[xf];
                    if (transformer) {
                        return transformer(value);
                    }
                }
                throw new ValueError(`no transformer named "${xf}"`);
            }
        );
    };
}

/**
 * Default format function without transformers
 *
 * @param template - Template string with placeholders
 * @param args - Values to interpolate
 * @returns Formatted string
 *
 * @example
 * stringFormat('Hello, {}!', 'Alice'); // => 'Hello, Alice!'
 * stringFormat('{0}, you have {1} unread message{2}', 'Holly', 2, 's');
 * // => 'Holly, you have 2 unread messages'
 * stringFormat('{firstName} {lastName}', {firstName: 'Jane', lastName: 'Smith'});
 * // => 'Jane Smith'
 */
export function stringFormat(template: string, ...args: any[]): string {
    return create({})(template, ...args);
}

/**
 * Extends a prototype (typically String.prototype) with a format method
 *
 * @param prototype - Prototype to extend (usually String.prototype)
 * @param transformers - Object mapping transformer names to functions
 *
 * @example
 * extend(String.prototype, { upper: s => s.toUpperCase() });
 * 'Hello, {!upper}!'.format('alice'); // => 'Hello, ALICE!'
 */
export function extend(prototype: any, transformers: Transformers): void {
    const formatFn = create(transformers);
    prototype.format = function (this: string, ...args: any[]): string {
        return formatFn(this, ...args);
    };
}
