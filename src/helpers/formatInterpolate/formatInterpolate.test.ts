/**
 * Test/Example file for formatInterpolate
 */

import { formatInterpolate } from './index';
import type { Token } from './types';

describe('formatInterpolate', () => {
    it('should format string specifier', () => {
        const tokens: Token[] = ['Hello ', { specifier: 's' }, '!'];
        const result = formatInterpolate(tokens, 'World');
        expect(result).toBe('Hello World!');
    });

    it('should format decimal integer', () => {
        const tokens: Token[] = ['The answer is ', { specifier: 'd' }];
        const result = formatInterpolate(tokens, 42);
        expect(result).toBe('The answer is 42');
    });

    it('should format hexadecimal', () => {
        const tokens: Token[] = ['Hex: ', { specifier: 'x' }];
        const result = formatInterpolate(tokens, 255);
        expect(result).toBe('Hex: ff');
    });

    it('should format uppercase hexadecimal', () => {
        const tokens: Token[] = ['Hex: ', { specifier: 'X' }];
        const result = formatInterpolate(tokens, 255);
        expect(result).toBe('Hex: FF');
    });

    it('should format binary', () => {
        const tokens: Token[] = ['Binary: ', { specifier: 'b' }];
        const result = formatInterpolate(tokens, 5);
        expect(result).toBe('Binary: 101');
    });

    it('should format octal', () => {
        const tokens: Token[] = ['Octal: ', { specifier: 'o' }];
        const result = formatInterpolate(tokens, 8);
        expect(result).toBe('Octal: 10');
    });

    it('should format float with precision', () => {
        const tokens: Token[] = ['Pi: ', { specifier: 'f', precision: 2 }];
        const result = formatInterpolate(tokens, Math.PI);
        expect(result).toBe('Pi: 3.14');
    });

    it('should format scientific notation', () => {
        const tokens: Token[] = ['Scientific: ', { specifier: 'e', precision: 2 }];
        const result = formatInterpolate(tokens, 1234.5);
        expect(result).toBe('Scientific: 1.23e+03');
    });

    it('should format with width padding', () => {
        const tokens: Token[] = ['[', { specifier: 'd', width: 5 }, ']'];
        const result = formatInterpolate(tokens, 42);
        expect(result).toBe('[   42]');
    });

    it('should format with zero padding', () => {
        const tokens: Token[] = ['[', { specifier: 'd', width: 5, flags: '0' }, ']'];
        const result = formatInterpolate(tokens, 42);
        expect(result).toBe('[00042]');
    });

    it('should format with right padding', () => {
        const tokens: Token[] = ['[', { specifier: 'd', width: 5, flags: '-' }, ']'];
        const result = formatInterpolate(tokens, 42);
        expect(result).toBe('[42   ]');
    });

    it('should format with sign', () => {
        const tokens: Token[] = ['Value: ', { specifier: 'd', flags: '+' }];
        const result = formatInterpolate(tokens, 42);
        expect(result).toBe('Value: +42');
    });

    it('should format with alternate form hexadecimal', () => {
        const tokens: Token[] = ['Hex: ', { specifier: 'x', flags: '#' }];
        const result = formatInterpolate(tokens, 255);
        expect(result).toBe('Hex: 0xff');
    });

    it('should format character', () => {
        const tokens: Token[] = ['Char: ', { specifier: 'c' }];
        const result = formatInterpolate(tokens, 65);
        expect(result).toBe('Char: A');
    });

    it('should format multiple arguments', () => {
        const tokens: Token[] = [
            'Name: ',
            { specifier: 's' },
            ', Age: ',
            { specifier: 'd' },
            ', Score: ',
            { specifier: 'f', precision: 1 },
        ];
        const result = formatInterpolate(tokens, 'Alice', 30, 95.7);
        expect(result).toBe('Name: Alice, Age: 30, Score: 95.7');
    });

    it('should truncate string with maxWidth', () => {
        const tokens: Token[] = ['Text: ', { specifier: 's', precision: 5 }];
        const result = formatInterpolate(tokens, 'HelloWorld');
        expect(result).toBe('Text: Hello');
    });

    it('should handle NaN', () => {
        const tokens: Token[] = ['Value: ', { specifier: 'f' }];
        const result = formatInterpolate(tokens, Number.NaN);
        expect(result).toBe('Value: nan'); // lowercase because %f is lowercase
    });

    it('should handle Infinity', () => {
        const tokens: Token[] = ['Value: ', { specifier: 'f' }];
        const result = formatInterpolate(tokens, Number.POSITIVE_INFINITY);
        expect(result).toBe('Value: infinity'); // lowercase because %f is lowercase
    });

    it('should throw on invalid specifier', () => {
        const tokens: Token[] = ['Value: ', { specifier: 'z' }];
        expect(() => formatInterpolate(tokens, 42)).toThrow('invalid specifier: z');
    });

    it('should throw on missing specifier', () => {
        const tokens: Token[] = ['Value: ', { specifier: '' }];
        expect(() => formatInterpolate(tokens, 42)).toThrow('missing `specifier` property');
    });
});
