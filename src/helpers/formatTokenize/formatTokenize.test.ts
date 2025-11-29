/**
 * Test file for formatTokenize
 */

import { formatTokenize } from './index';

describe('formatTokenize', () => {
    it('should tokenize a simple string with one specifier', () => {
        const tokens = formatTokenize('Hello %s!');
        expect(tokens).toHaveLength(3);
        expect(tokens[0]).toBe('Hello ');
        expect(tokens[1]).toMatchObject({ specifier: 's', flags: '' });
        expect(tokens[2]).toBe('!');
    });

    it('should tokenize a string with no specifiers', () => {
        const tokens = formatTokenize('Hello World!');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toBe('Hello World!');
    });

    it('should tokenize multiple specifiers', () => {
        const tokens = formatTokenize('Name: %s, Age: %d');
        expect(tokens).toHaveLength(4);
        expect(tokens[0]).toBe('Name: ');
        expect(tokens[1]).toMatchObject({ specifier: 's', flags: '' });
        expect(tokens[2]).toBe(', Age: ');
        expect(tokens[3]).toMatchObject({ specifier: 'd', flags: '' });
    });

    it('should handle escaped percent sign', () => {
        const tokens = formatTokenize('100%% complete');
        expect(tokens).toHaveLength(3);
        expect(tokens[0]).toBe('100');
        expect(tokens[1]).toBe('%');
        expect(tokens[2]).toBe(' complete');
    });

    it('should parse width', () => {
        const tokens = formatTokenize('%5d');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'd',
            width: '5',
            flags: '',
        });
    });

    it('should parse precision', () => {
        const tokens = formatTokenize('%.2f');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'f',
            precision: '2',
            flags: '',
        });
    });

    it('should parse width and precision', () => {
        const tokens = formatTokenize('%8.2f');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'f',
            width: '8',
            precision: '2',
            flags: '',
        });
    });

    it('should parse flags', () => {
        const tokens = formatTokenize('%0+5d');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'd',
            width: '5',
            flags: '0+',
        });
    });

    it('should parse multiple flags', () => {
        const tokens = formatTokenize('%#0-10x');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'x',
            width: '10',
            flags: '#0-',
        });
    });

    it('should parse position mapping', () => {
        const tokens = formatTokenize('%2$s %1$s');
        expect(tokens).toHaveLength(3);
        expect(tokens[0]).toMatchObject({
            specifier: 's',
            mapping: 2,
            flags: '',
        });
        expect(tokens[1]).toBe(' ');
        expect(tokens[2]).toMatchObject({
            specifier: 's',
            mapping: 1,
            flags: '',
        });
    });

    it('should parse dynamic width (*)', () => {
        const tokens = formatTokenize('%*d');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'd',
            width: '*',
            flags: '',
        });
    });

    it('should parse dynamic precision (*)', () => {
        const tokens = formatTokenize('%.*f');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'f',
            precision: '*',
            flags: '',
        });
    });

    it('should parse period with no precision as precision 1', () => {
        const tokens = formatTokenize('%.f');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'f',
            precision: '1',
            flags: '',
        });
    });

    it('should parse complex format string', () => {
        const tokens = formatTokenize('Pi: %+8.2f, Hex: %#06x');
        expect(tokens).toHaveLength(4);
        expect(tokens[0]).toBe('Pi: ');
        expect(tokens[1]).toMatchObject({
            specifier: 'f',
            width: '8',
            precision: '2',
            flags: '+',
        });
        expect(tokens[2]).toBe(', Hex: ');
        expect(tokens[3]).toMatchObject({
            specifier: 'x',
            width: '6', // 0 is a flag, not part of width
            flags: '#0',
        });
    });
    it('should handle various specifiers', () => {
        const specifiers = ['b', 'o', 'd', 'i', 'u', 'x', 'X', 'f', 'F', 'e', 'E', 'g', 'G', 's', 'c'];

        for (const spec of specifiers) {
            const tokens = formatTokenize(`%${spec}`);
            expect(tokens).toHaveLength(1);
            expect(tokens[0]).toMatchObject({
                specifier: spec,
                flags: '',
            });
        }
    });

    it('should ignore length modifiers', () => {
        const tokens = formatTokenize('%hd %ld %Ld');
        expect(tokens).toHaveLength(5);
        expect(tokens[0]).toMatchObject({ specifier: 'd' });
        expect(tokens[2]).toMatchObject({ specifier: 'd' });
        expect(tokens[4]).toMatchObject({ specifier: 'd' });
    });

    it('should handle empty string', () => {
        const tokens = formatTokenize('');
        expect(tokens).toHaveLength(0);
    });

    it('should handle string with only format specifier', () => {
        const tokens = formatTokenize('%s');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({ specifier: 's', flags: '' });
    });

    it('should preserve spaces in flags', () => {
        const tokens = formatTokenize('% d');
        expect(tokens).toHaveLength(1);
        expect(tokens[0]).toMatchObject({
            specifier: 'd',
            flags: ' ',
        });
    });

    it('should handle consecutive format specifiers', () => {
        const tokens = formatTokenize('%s%d%f');
        expect(tokens).toHaveLength(3);
        expect(tokens[0]).toMatchObject({ specifier: 's' });
        expect(tokens[1]).toMatchObject({ specifier: 'd' });
        expect(tokens[2]).toMatchObject({ specifier: 'f' });
    });

    it('should handle mixed escaped and real percent signs', () => {
        const tokens = formatTokenize('%%s %s %%');
        expect(tokens).toHaveLength(5);
        expect(tokens[0]).toBe('%');
        expect(tokens[1]).toBe('s ');
        expect(tokens[2]).toMatchObject({ specifier: 's' });
        expect(tokens[3]).toBe(' ');
        expect(tokens[4]).toBe('%');
    });
});
