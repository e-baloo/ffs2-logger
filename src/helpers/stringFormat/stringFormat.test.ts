/**
 * @license Apache-2.0
 *
 * Tests for string-format
 */

import { describe, expect, it } from '@jest/globals';
import { create, stringFormat } from './stringFormat';
import { ValueError } from './ValueError';

describe('stringFormat', () => {
    describe('basic functionality', () => {
        it('should format simple placeholders', () => {
            expect(stringFormat('Hello, {}!', 'Alice')).toBe('Hello, Alice!');
        });

        it('should format multiple placeholders', () => {
            expect(stringFormat('{}, you have {} unread message{}', 'Steve', 1, '')).toBe(
                'Steve, you have 1 unread message'
            );
        });

        it('should handle missing arguments', () => {
            expect(stringFormat('{0}, you have {1} unread message{2}', 'Steve', 1)).toBe(
                'Steve, you have 1 unread message'
            );
        });
    });

    describe('explicit numbering', () => {
        it('should support explicit positional arguments', () => {
            expect(stringFormat('{0}, you have {1} unread message{2}', 'Holly', 2, 's')).toBe(
                'Holly, you have 2 unread messages'
            );
        });

        it('should reference same argument multiple times', () => {
            expect(stringFormat("The name's {1}. {0} {1}.", 'James', 'Bond')).toBe("The name's Bond. James Bond.");
        });
    });

    describe('implicit numbering', () => {
        it('should use implicit numbering without indices', () => {
            expect(stringFormat('{}, you have {} unread message{}', 'Steve', 1, '')).toBe(
                'Steve, you have 1 unread message'
            );
        });

        it('should not mix implicit and explicit numbering', () => {
            expect(() => stringFormat('My name is {} {}. Do you like the name {0}?', 'Lemony', 'Snicket')).toThrow(
                ValueError
            );
            expect(() => stringFormat('My name is {} {}. Do you like the name {0}?', 'Lemony', 'Snicket')).toThrow(
                'cannot switch from implicit to explicit numbering'
            );
        });

        it('should not switch from explicit to implicit', () => {
            expect(() => stringFormat('My name is {0} {1}. Do you like the name {}?', 'Lemony', 'Snicket')).toThrow(
                ValueError
            );
            expect(() => stringFormat('My name is {0} {1}. Do you like the name {}?', 'Lemony', 'Snicket')).toThrow(
                'cannot switch from explicit to implicit numbering'
            );
        });
    });

    describe('escaped braces', () => {
        it('should handle escaped braces', () => {
            expect(stringFormat('{{}} creates an empty {} in {}', 'dictionary', 'Python')).toBe(
                '{} creates an empty dictionary in Python'
            );
        });

        it('should handle multiple escaped braces', () => {
            expect(stringFormat('{{foo}} and {{bar}}', 'test')).toBe('{foo} and {bar}');
        });
    });

    describe('object properties', () => {
        it('should access object properties with dot notation', () => {
            const bobby = { firstName: 'Bobby', lastName: 'Fischer' };
            const garry = { firstName: 'Garry', lastName: 'Kasparov' };
            expect(stringFormat('{0.firstName} {0.lastName} vs. {1.firstName} {1.lastName}', bobby, garry)).toBe(
                'Bobby Fischer vs. Garry Kasparov'
            );
        });

        it('should omit 0. when referencing first argument property', () => {
            const repo = { owner: 'davidchambers', slug: 'string-format' };
            expect(stringFormat('https://github.com/{owner}/{slug}', repo)).toBe(
                'https://github.com/davidchambers/string-format'
            );
        });

        it('should invoke method properties', () => {
            const sheldon = {
                firstName: 'Sheldon',
                lastName: 'Cooper',
                dob: new Date('1970-01-01'),
                fullName() {
                    return `${this.firstName} ${this.lastName}`;
                },
                quip() {
                    return 'Bazinga!';
                },
            };

            expect(stringFormat('{fullName} was born at precisely {dob.toISOString}', sheldon)).toBe(
                'Sheldon Cooper was born at precisely 1970-01-01T00:00:00.000Z'
            );

            expect(stringFormat("I've always wanted to go to a goth club. {quip.toUpperCase}", sheldon)).toBe(
                "I've always wanted to go to a goth club. BAZINGA!"
            );
        });

        it('should handle nested properties', () => {
            const user = {
                name: 'Alice',
                address: {
                    city: 'Paris',
                    country: 'France',
                },
            };
            expect(stringFormat('{name} lives in {address.city}, {address.country}', user)).toBe(
                'Alice lives in Paris, France'
            );
        });
    });

    describe('transformers', () => {
        it('should apply transformers', () => {
            const fmt = create({
                upper: s => s.toUpperCase(),
                lower: s => s.toLowerCase(),
            });

            expect(fmt('Hello, {!upper}!', 'alice')).toBe('Hello, ALICE!');
            expect(fmt('Hello, {!lower}!', 'BOB')).toBe('Hello, bob!');
        });

        it('should apply transformers with positional arguments', () => {
            const fmt = create({
                upper: s => s.toUpperCase(),
            });

            expect(fmt('Hello, {0!upper} and {1!upper}!', 'alice', 'bob')).toBe('Hello, ALICE and BOB!');
        });

        it('should apply transformers with object properties', () => {
            const fmt = create({
                escape: s => s.replace(/[&<>"'`]/g, (c: string) => `&#${c.charCodeAt(0)};`),
            });

            const data = {
                name: 'Anchor & Hope',
                url: 'http://anchorandhopesf.com/',
            };

            expect(fmt('<a href="{url!escape}">{name!escape}</a>', data)).toBe(
                '<a href="http://anchorandhopesf.com/">Anchor &#38; Hope</a>'
            );
        });

        it('should throw error for unknown transformer', () => {
            const fmt = create({});
            expect(() => fmt('Hello, {!unknown}!', 'Alice')).toThrow(ValueError);
            expect(() => fmt('Hello, {!unknown}!', 'Alice')).toThrow('no transformer named "unknown"');
        });
    });

    describe('edge cases', () => {
        it('should handle empty template', () => {
            expect(stringFormat('')).toBe('');
        });

        it('should handle template without placeholders', () => {
            expect(stringFormat('Hello World')).toBe('Hello World');
        });

        it('should handle undefined values', () => {
            expect(stringFormat('Value: {}', undefined)).toBe('Value: undefined');
        });

        it('should handle null values', () => {
            expect(stringFormat('Value: {}', null)).toBe('Value: null');
        });

        it('should handle number values', () => {
            expect(stringFormat('Number: {}', 42)).toBe('Number: 42');
            expect(stringFormat('Float: {}', 3.14)).toBe('Float: 3.14');
        });

        it('should handle boolean values', () => {
            expect(stringFormat('Boolean: {}', true)).toBe('Boolean: true');
            expect(stringFormat('Boolean: {}', false)).toBe('Boolean: false');
        });

        it('should handle array values', () => {
            expect(stringFormat('Array: {}', [1, 2, 3])).toBe('Array: 1,2,3');
        });

        it('should handle object values', () => {
            expect(stringFormat('Object: {}', { x: 1, y: 2 })).toBe('Object: [object Object]');
        });
    });
});
