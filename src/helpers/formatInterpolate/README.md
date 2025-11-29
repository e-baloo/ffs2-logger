# Format Interpolate

TypeScript conversion of [stdlib-js/string-base-format-interpolate](https://github.com/stdlib-js/string-base-format-interpolate).

Generates strings from token arrays by interpolating values with printf-style format specifiers.

## Installation

```typescript
import { formatInterpolate } from '@src/v2/helpers/formatInterpolate';
```

## Usage

### Basic String Formatting

```typescript
const tokens = ['Hello ', { specifier: 's' }, '!'];
const result = formatInterpolate(tokens, 'World');
// => 'Hello World!'
```

### Number Formatting

```typescript
// Decimal integer
formatInterpolate(['Value: ', { specifier: 'd' }], 42);
// => 'Value: 42'

// Hexadecimal
formatInterpolate(['Hex: ', { specifier: 'x' }], 255);
// => 'Hex: ff'

// Binary
formatInterpolate(['Binary: ', { specifier: 'b' }], 5);
// => 'Binary: 101'

// Octal
formatInterpolate(['Octal: ', { specifier: 'o' }], 8);
// => 'Octal: 10'
```

### Float Formatting

```typescript
// Fixed-point
formatInterpolate(['Pi: ', { specifier: 'f', precision: 2 }], 3.14159);
// => 'Pi: 3.14'

// Scientific notation
formatInterpolate(['Scientific: ', { specifier: 'e', precision: 2 }], 1234.5);
// => 'Scientific: 1.23e+03'

// Shorter of fixed or scientific
formatInterpolate(['Value: ', { specifier: 'g', precision: 3 }], 0.000123);
// => 'Value: 1.23e-04'
```

### Padding

```typescript
// Space padding (default)
formatInterpolate(['[', { specifier: 'd', width: 5 }, ']'], 42);
// => '[   42]'

// Zero padding
formatInterpolate(['[', { specifier: 'd', width: 5, flags: '0' }, ']'], 42);
// => '[00042]'

// Right padding
formatInterpolate(['[', { specifier: 'd', width: 5, flags: '-' }, ']'], 42);
// => '[42   ]'
```

### Signs and Alternate Forms

```typescript
// Force sign
formatInterpolate(['Value: ', { specifier: 'd', flags: '+' }], 42);
// => 'Value: +42'

// Space for positive
formatInterpolate(['Value: ', { specifier: 'd', flags: ' ' }], 42);
// => 'Value:  42'

// Alternate form (0x prefix for hex)
formatInterpolate(['Hex: ', { specifier: 'x', flags: '#' }], 255);
// => 'Hex: 0xff'

// Alternate form (0 prefix for octal)
formatInterpolate(['Octal: ', { specifier: 'o', flags: '#' }], 8);
// => 'Octal: 010'
```

### Multiple Arguments

```typescript
const tokens = [
	'Name: ',
	{ specifier: 's' },
	', Age: ',
	{ specifier: 'd' },
	', Score: ',
	{ specifier: 'f', precision: 1 },
];
formatInterpolate(tokens, 'Alice', 30, 95.7);
// => 'Name: Alice, Age: 30, Score: 95.7'
```

## Format Specifiers

| Specifier | Description                                        | Example                  |
| --------- | -------------------------------------------------- | ------------------------ |
| `%b`      | Binary integer                                     | `101`                    |
| `%o`      | Octal integer                                      | `10`                     |
| `%d`      | Decimal integer                                    | `42`                     |
| `%i`      | Integer (alias for %d)                             | `42`                     |
| `%u`      | Unsigned decimal integer                           | `42`                     |
| `%x`      | Hexadecimal (lowercase)                            | `ff`                     |
| `%X`      | Hexadecimal (uppercase)                            | `FF`                     |
| `%f`      | Fixed-point notation                               | `3.14`                   |
| `%F`      | Fixed-point notation (uppercase for special)       | `3.14`                   |
| `%e`      | Scientific notation (lowercase)                    | `1.23e+03`               |
| `%E`      | Scientific notation (uppercase)                    | `1.23E+03`               |
| `%g`      | Shorter of %e or %f                                | `1.23` or `1.23e+03`     |
| `%G`      | Shorter of %E or %F                                | `1.23` or `1.23E+03`     |
| `%s`      | String                                             | `hello`                  |
| `%c`      | Character (from ASCII code)                        | `A` (from 65)            |

## Format Options

### Width

Minimum field width. If the formatted value is shorter, it will be padded.

```typescript
{ specifier: 'd', width: 5 }
```

### Precision

For integers: minimum number of digits (zero-padded if needed)
For floats: number of decimal places
For strings: maximum number of characters

```typescript
{ specifier: 'f', precision: 2 }
{ specifier: 's', precision: 5 }  // truncate to 5 chars
```

### Flags

| Flag | Description                                        |
| ---- | -------------------------------------------------- |
| `-`  | Left-align (pad to the right)                      |
| `+`  | Force sign for positive numbers                    |
| ` `  | Space before positive numbers                      |
| `0`  | Zero-pad instead of space-pad                      |
| `#`  | Alternate form (0x for hex, 0 for octal, etc.)     |

Multiple flags can be combined:

```typescript
{ specifier: 'x', width: 8, flags: '#0' }  // '0x00ff'
```

## Token Format

```typescript
interface FormatToken {
	specifier: string;           // Required: format specifier (b, o, x, X, d, i, u, s, c, e, E, f, F, g, G)
	precision?: number | string; // Optional: precision or '*' for dynamic
	width?: number | string;     // Optional: field width or '*' for dynamic
	flags?: string;              // Optional: format flags (-, +, space, 0, #)
	mapping?: number;            // Optional: argument position (1-indexed)
}
```

## Special Values

```typescript
// NaN
formatInterpolate(['Value: ', { specifier: 'f' }], NaN);
// => 'Value: NaN'

// Infinity
formatInterpolate(['Value: ', { specifier: 'f' }], Infinity);
// => 'Value: Infinity'

// -Infinity
formatInterpolate(['Value: ', { specifier: 'f' }], -Infinity);
// => 'Value: -Infinity'
```

## Error Handling

```typescript
// Invalid specifier
formatInterpolate(['Value: ', { specifier: 'z' }], 42);
// => Error: invalid specifier: z

// Missing specifier
formatInterpolate(['Value: ', { specifier: '' }], 42);
// => TypeError: Token is missing `specifier` property

// Invalid argument type
formatInterpolate(['Value: ', { specifier: 'd' }], 'not a number');
// => Error: invalid integer. Value: not a number
```

## TypeScript Types

```typescript
import type { FormatToken, Token } from './types';

// Token can be either a string or a FormatToken
type Token = string | FormatToken;

// Function signature
function formatInterpolate(tokens: Token[], ...args: any[]): string;
```

## License

Apache-2.0 (converted from stdlib-js/string-base-format-interpolate)
