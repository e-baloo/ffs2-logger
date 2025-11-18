# Format Tokenize

TypeScript conversion of [stdlib-js/string-base-format-tokenize](https://github.com/stdlib-js/string-base-format-tokenize).

Tokenizes a string with printf-style format specifiers into an array of string parts and format identifier objects.

## Installation

```typescript
import { formatTokenize } from '@src/v2/helpers/formatTokenize';
```

## Usage

### Basic Tokenization

```typescript
const tokens = formatTokenize('Hello %s!');
// => ['Hello ', { flags: '', specifier: 's', ... }, '!']
```

### Multiple Specifiers

```typescript
const tokens = formatTokenize('Name: %s, Age: %d, Score: %.2f');
// => [
//   'Name: ',
//   { flags: '', specifier: 's', ... },
//   ', Age: ',
//   { flags: '', specifier: 'd', ... },
//   ', Score: ',
//   { flags: '', precision: '2', specifier: 'f', ... }
// ]
```

### Escaped Percent Signs

```typescript
const tokens = formatTokenize('100%% complete');
// => ['100', '%', ' complete']
```

### Width and Precision

```typescript
// Width
const tokens1 = formatTokenize('%5d');
// => [{ flags: '', width: '5', specifier: 'd', ... }]

// Precision
const tokens2 = formatTokenize('%.2f');
// => [{ flags: '', precision: '2', specifier: 'f', ... }]

// Both
const tokens3 = formatTokenize('%8.2f');
// => [{ flags: '', width: '8', precision: '2', specifier: 'f', ... }]
```

### Format Flags

```typescript
// Zero padding
const tokens1 = formatTokenize('%05d');
// => [{ flags: '0', width: '5', specifier: 'd', ... }]

// Force sign
const tokens2 = formatTokenize('%+d');
// => [{ flags: '+', specifier: 'd', ... }]

// Left align
const tokens3 = formatTokenize('%-10s');
// => [{ flags: '-', width: '10', specifier: 's', ... }]

// Alternate form
const tokens4 = formatTokenize('%#x');
// => [{ flags: '#', specifier: 'x', ... }]

// Space for positive
const tokens5 = formatTokenize('% d');
// => [{ flags: ' ', specifier: 'd', ... }]

// Multiple flags
const tokens6 = formatTokenize('%#0-10x');
// => [{ flags: '#0-', width: '10', specifier: 'x', ... }]
```

### Argument Position Mapping

```typescript
// Reorder arguments
const tokens = formatTokenize('%2$s %1$s');
// => [
//   { flags: '', specifier: 's', mapping: 2, ... },
//   ' ',
//   { flags: '', specifier: 's', mapping: 1, ... }
// ]
```

### Dynamic Width and Precision

```typescript
// Dynamic width (*)
const tokens1 = formatTokenize('%*d');
// => [{ flags: '', width: '*', specifier: 'd', ... }]

// Dynamic precision (*)
const tokens2 = formatTokenize('%.*f');
// => [{ flags: '', precision: '*', specifier: 'f', ... }]

// Both dynamic
const tokens3 = formatTokenize('%*.*f');
// => [{ flags: '', width: '*', precision: '*', specifier: 'f', ... }]
```

## Format Specifier Pattern

The tokenizer recognizes the following printf-style pattern:

```
%[position$][flags][width][.precision][length]specifier
```

### Components

| Component   | Description                                  | Examples           |
| ----------- | -------------------------------------------- | ------------------ |
| `position$` | Optional 1-indexed argument position         | `1$`, `2$`, `10$`  |
| `flags`     | Zero or more formatting flags                | `0`, `+`, `-`, `#`, ` ` |
| `width`     | Minimum field width                          | `5`, `10`, `*`     |
| `.precision`| Precision (preceded by `.`)                  | `.2`, `.5`, `.*`   |
| `length`    | Length modifier (ignored)                    | `h`, `l`, `L`      |
| `specifier` | Required format specifier                    | `s`, `d`, `f`, etc. |

### Supported Specifiers

| Specifier | Description                     |
| --------- | ------------------------------- |
| `%`       | Literal percent sign            |
| `b`       | Binary integer                  |
| `o`       | Octal integer                   |
| `d`, `i`  | Decimal integer                 |
| `u`       | Unsigned decimal integer        |
| `x`       | Hexadecimal (lowercase)         |
| `X`       | Hexadecimal (uppercase)         |
| `f`, `F`  | Fixed-point notation            |
| `e`, `E`  | Scientific notation             |
| `g`, `G`  | Shorter of fixed or scientific  |
| `s`       | String                          |
| `c`       | Character                       |
| `A-Z`, `a-z` | Any letter is accepted       |

### Flags

| Flag | Description                               |
| ---- | ----------------------------------------- |
| `-`  | Left-align within the field width         |
| `+`  | Force sign (+ or -) for numbers           |
| ` `  | Insert space before positive numbers      |
| `0`  | Zero-pad instead of space-pad             |
| `#`  | Alternate form (0x for hex, etc.)         |

## Token Format

```typescript
interface FormatToken {
	/** Argument mapping position (1-indexed) */
	mapping?: number;
	/** Format flags (0, +, -, space, #) */
	flags: string;
	/** Width for padding (* or number string) */
	width?: string;
	/** Precision (* or number string) */
	precision?: string;
	/** Format specifier character */
	specifier: string;
}

type Token = string | FormatToken;
```

## Examples

### Simple Logging

```typescript
const tokens = formatTokenize('[%s] %s');
// => ['[', {..., specifier: 's'}, '] ', {..., specifier: 's'}]
```

### Formatted Numbers

```typescript
const tokens = formatTokenize('Total: $%,.2f');
// => ['Total: $', {..., flags: ',', precision: '2', specifier: 'f'}]
```

### Debug Output

```typescript
const tokens = formatTokenize('Hex: %#08x, Binary: %b, Decimal: %d');
// => [
//   'Hex: ',
//   {..., flags: '#0', width: '8', specifier: 'x'},
//   ', Binary: ',
//   {..., specifier: 'b'},
//   ', Decimal: ',
//   {..., specifier: 'd'}
// ]
```

### Table Formatting

```typescript
const tokens = formatTokenize('%-10s %5d %8.2f');
// => [
//   {..., flags: '-', width: '10', specifier: 's'},
//   ' ',
//   {..., width: '5', specifier: 'd'},
//   ' ',
//   {..., width: '8', precision: '2', specifier: 'f'}
// ]
```

## Integration with formatInterpolate

This tokenizer is designed to work with `formatInterpolate`:

```typescript
import { formatTokenize } from '@src/v2/helpers/formatTokenize';
import { formatInterpolate } from '@src/v2/helpers/formatInterpolate';

const str = 'Hello %s, you are %d years old!';
const tokens = formatTokenize(str);
const result = formatInterpolate(tokens, 'Alice', 30);
// => 'Hello Alice, you are 30 years old!'
```

## Special Cases

### Empty String

```typescript
const tokens = formatTokenize('');
// => []
```

### No Format Specifiers

```typescript
const tokens = formatTokenize('Plain text');
// => ['Plain text']
```

### Only Format Specifier

```typescript
const tokens = formatTokenize('%s');
// => [{ flags: '', specifier: 's', ... }]
```

### Consecutive Specifiers

```typescript
const tokens = formatTokenize('%s%d%f');
// => [
//   {..., specifier: 's'},
//   {..., specifier: 'd'},
//   {..., specifier: 'f'}
// ]
```

### Period Without Precision

```typescript
const tokens = formatTokenize('%.f');
// => [{ flags: '', precision: '1', specifier: 'f', ... }]
// Note: precision defaults to '1' when . is present without a number
```

## TypeScript Types

```typescript
import type { FormatToken, Token } from '@src/v2/helpers/formatTokenize';

function processTokens(tokens: Token[]): void {
	for (const token of tokens) {
		if (typeof token === 'string') {
			console.log('Literal:', token);
		} else {
			console.log('Format:', token.specifier);
		}
	}
}
```

## License

Apache-2.0 (converted from stdlib-js/string-base-format-tokenize)
