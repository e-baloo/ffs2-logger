# String Formatting Libraries Comparison

This logger library now includes three different string formatting approaches, each with its own strengths.

## Quick Reference

| Library | Style | Example | Best For |
|---------|-------|---------|----------|
| **format** (printf) | C-style | `format('%.2f', 3.14)` | Numeric formatting, precision control |
| **stringFormat** (Python) | Python-style | `stringFormat('{} {}', 'hi', 'there')` | Object properties, templates |
| **formatInterpolate + formatTokenize** | Custom | Low-level control | Advanced use cases |

## 1. Printf-Style Formatting (`format`)

**Source**: stdlib-js/string-base-format-interpolate + formatTokenize  
**Style**: C printf  
**Syntax**: `%[flags][width][.precision]specifier`

### Strengths
- Precise numeric formatting (padding, precision, signs)
- Binary, octal, decimal, hexadecimal output
- Scientific notation
- Fixed-point notation
- Zero-padding and space-padding

### Examples

```typescript
import { format } from './helpers';

// Numeric formatting
format('%d', 42);                    // => '42'
format('%.2f', 3.14159);             // => '3.14'
format('%e', 1234.5);                // => '1.2345e+3'

// Padding
format('%5d', 42);                   // => '   42'
format('%05d', 42);                  // => '00042'

// Signs and bases
format('%+d', 42);                   // => '+42'
format('%x', 255);                   // => 'ff'
format('%#x', 255);                  // => '0xff'
format('%o', 8);                     // => '10'

// Multiple values
format('x=%d, y=%d', 10, 20);        // => 'x=10, y=20'
```

### Format Specifiers

| Specifier | Type | Example |
|-----------|------|---------|
| `%d`, `%i` | Integer (decimal) | `42` |
| `%u` | Unsigned integer | `42` |
| `%x` | Hex (lowercase) | `ff` |
| `%X` | Hex (uppercase) | `FF` |
| `%o` | Octal | `52` |
| `%b` | Binary | `101010` |
| `%f` | Float (fixed-point) | `3.14` |
| `%e` | Scientific (lowercase) | `1.23e+4` |
| `%E` | Scientific (uppercase) | `1.23E+4` |
| `%g` | Shortest float representation | `3.14` or `1e+10` |
| `%s` | String | `hello` |
| `%c` | Character | `A` |

### When to Use
- You need precise numeric formatting
- You want C-style format strings
- You need control over padding and precision
- You're formatting scientific data

## 2. Python-Style Formatting (`stringFormat`)

**Source**: davidchambers/string-format  
**Style**: Python str.format()  
**Syntax**: `{[index][.property][!transformer]}`

### Strengths
- Object property access
- Method invocation
- Custom transformers
- Clean, readable templates
- Implicit numbering

### Examples

```typescript
import { stringFormat, createStringFormat } from './helpers';

// Basic usage
stringFormat('Hello, {}!', 'World');              // => 'Hello, World!'
stringFormat('{}, you have {} messages', 'John', 5);  // => 'John, you have 5 messages'

// Explicit indexing
stringFormat('{0} {1} {0}', 'foo', 'bar');        // => 'foo bar foo'

// Object properties
const user = { name: 'Alice', age: 30 };
stringFormat('{name} is {age} years old', user);  // => 'Alice is 30 years old'

// Nested properties
const data = { user: { name: 'Bob' }, count: 10 };
stringFormat('{user.name} has {count} items', data);  // => 'Bob has 10 items'

// Method invocation
const obj = {
  value: 'hello',
  upper() { return this.value.toUpperCase(); }
};
stringFormat('{upper}', obj);                     // => 'HELLO'

// Custom transformers
const fmt = createStringFormat({
  upper: s => s.toUpperCase(),
  escape: s => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)
});

fmt('Hello, {!upper}!', 'alice');                 // => 'Hello, ALICE!'
fmt('<p>{!escape}</p>', 'A & B');                 // => '<p>A &#38; B</p>'

// Escaped braces
stringFormat('Use {{}} for placeholders');        // => 'Use {} for placeholders'
```

### When to Use
- You're formatting with object data
- You need property access in templates
- You want custom transformations
- You prefer readable template syntax
- You're building user-facing templates

## 3. Low-Level APIs

For advanced use cases, you can use the underlying APIs directly:

```typescript
import { formatTokenize, formatInterpolate } from './helpers';

// Tokenize format string
const tokens = formatTokenize('Value: %d');
// => [{ type: 'literal', value: 'Value: ' }, { type: 'specifier', ... }]

// Interpolate with values
const result = formatInterpolate(tokens, 42);
// => 'Value: 42'
```

## Choosing the Right Library

### Use `format` (printf-style) when:
- ✅ Formatting numbers with specific precision
- ✅ Need padding, signs, alternate forms
- ✅ Output in different bases (binary, octal, hex)
- ✅ Scientific notation required
- ✅ C-style format strings expected

### Use `stringFormat` (Python-style) when:
- ✅ Working with objects and properties
- ✅ Building readable templates
- ✅ Need method invocation
- ✅ Want custom transformers
- ✅ User-facing string templates

### Use low-level APIs when:
- ✅ Building custom formatters
- ✅ Need token-level control
- ✅ Performance optimization required
- ✅ Custom format string parsing

## Combined Example

Both styles can coexist:

```typescript
import { format, stringFormat } from './helpers';

const user = {
  name: 'Alice',
  balance: 1234.567,
  transactions: 42
};

// Printf-style for precise numbers
const balanceStr = format('Balance: $%.2f', user.balance);
// => 'Balance: $1234.57'

// Python-style for object templates
const userStr = stringFormat('{name} has {transactions} transactions', user);
// => 'Alice has 42 transactions'

// Combined
const message = `${userStr}. ${balanceStr}`;
// => 'Alice has 42 transactions. Balance: $1234.57'
```

## Performance Considerations

- **format**: Medium overhead (regex tokenization)
- **stringFormat**: Medium overhead (regex replacement, property lookup)
- **Low-level APIs**: Lowest overhead (reuse tokens)

For hot paths, consider pre-tokenizing format strings:

```typescript
// One-time tokenization
const tokens = formatTokenize('Result: %d');

// Reuse tokens in loop
for (let i = 0; i < 1000000; i++) {
  const result = formatInterpolate(tokens, i);
}
```

## Integration with Logger

All three approaches are available in the logger:

```typescript
import { Logger } from './Logger';
import { format, stringFormat } from './helpers';

const logger = new Logger();

// Printf-style in log messages
logger.info(format('User %d logged in at %.2f seconds', userId, timestamp));

// Python-style in log messages
logger.info(stringFormat('User {name} performed {action}', { name: 'Alice', action: 'login' }));
```

## License

All three implementations are licensed under Apache-2.0.
