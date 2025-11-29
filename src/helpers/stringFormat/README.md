# string-format

Python-style string formatting for TypeScript/JavaScript.

Based on [davidchambers/string-format](https://github.com/davidchambers/string-format).

## Overview

This library provides Python-style string formatting with `{}` placeholders, supporting:
- Implicit and explicit positional arguments
- Object property access with dot notation
- Method invocation
- Custom transformers
- Escaped braces

## Usage

### Basic Formatting

```typescript
import { stringFormat } from './stringFormat';

// Implicit numbering
stringFormat('Hello, {}!', 'Alice');
// => 'Hello, Alice!'

stringFormat('{}, you have {} unread message{}', 'Steve', 1, '');
// => 'Steve, you have 1 unread message'
```

### Explicit Numbering

```typescript
// Reference arguments by position
stringFormat('{0}, you have {1} unread message{2}', 'Holly', 2, 's');
// => 'Holly, you have 2 unread messages'

// Reference same argument multiple times
stringFormat("The name's {1}. {0} {1}.", 'James', 'Bond');
// => "The name's Bond. James Bond."
```

⚠️ **Important**: You cannot mix implicit and explicit numbering in the same format string.

```typescript
// This will throw ValueError
stringFormat('My name is {} {}. Do you like the name {0}?', 'Lemony', 'Snicket');
// => ValueError: cannot switch from implicit to explicit numbering
```

### Escaped Braces

Use `{{` and `}}` to produce literal braces:

```typescript
stringFormat('{{}} creates an empty {} in {}', 'dictionary', 'Python');
// => '{} creates an empty dictionary in Python'
```

### Object Properties

Access object properties using dot notation:

```typescript
const bobby = { firstName: 'Bobby', lastName: 'Fischer' };
const garry = { firstName: 'Garry', lastName: 'Kasparov' };

stringFormat('{0.firstName} {0.lastName} vs. {1.firstName} {1.lastName}', bobby, garry);
// => 'Bobby Fischer vs. Garry Kasparov'
```

When referencing properties of the first argument (`{0}`), you can omit `0.`:

```typescript
const repo = { owner: 'davidchambers', slug: 'string-format' };

stringFormat('https://github.com/{owner}/{slug}', repo);
// => 'https://github.com/davidchambers/string-format'
```

### Method Invocation

If the referenced property is a method, it's invoked with no arguments:

```typescript
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

stringFormat('{fullName} was born at precisely {dob.toISOString}', sheldon);
// => 'Sheldon Cooper was born at precisely 1970-01-01T00:00:00.000Z'

stringFormat("I've always wanted to go to a goth club. {quip.toUpperCase}", sheldon);
// => "I've always wanted to go to a goth club. BAZINGA!"
```

### Custom Transformers

Create a format function with custom transformers:

```typescript
import { create } from './stringFormat';

const fmt = create({
	upper: (s) => s.toUpperCase(),
	lower: (s) => s.toLowerCase(),
	escape: (s) => s.replace(/[&<>"'`]/g, (c) => `&#${c.charCodeAt(0)};`),
});

fmt('Hello, {!upper}!', 'alice');
// => 'Hello, ALICE!'

fmt('<a href="{url!escape}">{name!escape}</a>', {
	name: 'Anchor & Hope',
	url: 'http://anchorandhopesf.com/',
});
// => '<a href="http://anchorandhopesf.com/">Anchor &#38; Hope</a>'
```

Transformers are specified with `!` after the placeholder:
- `{!upper}` - Apply `upper` transformer to implicit argument
- `{0!upper}` - Apply `upper` transformer to argument 0
- `{name!escape}` - Apply `escape` transformer to `name` property

### Extending String.prototype

You can add a `format` method to `String.prototype`:

```typescript
import { extend } from './stringFormat';

extend(String.prototype, {
	upper: (s) => s.toUpperCase(),
});

// Now you can use method syntax
'Hello, {!upper}!'.format('alice');
// => 'Hello, ALICE!'
```

## API Reference

### `stringFormat(template, ...args)`

Formats a template string with the given arguments.

- **template**: Template string with `{}` placeholders
- **args**: Values to interpolate
- **Returns**: Formatted string

### `create(transformers)`

Creates a custom format function with transformers.

- **transformers**: Object mapping transformer names to functions
- **Returns**: Format function

### `extend(prototype, transformers)`

Extends a prototype with a `format` method.

- **prototype**: Prototype to extend (typically `String.prototype`)
- **transformers**: Object mapping transformer names to functions

### `ValueError`

Error thrown when format string is invalid.

## Differences from Printf-Style Formatting

| Feature | string-format | printf-style |
|---------|---------------|--------------|
| Placeholder | `{}` | `%s`, `%d`, etc. |
| Style | Python | C |
| Properties | `{user.name}` | Not supported |
| Transformers | `{!upper}` | Not supported |
| Type safety | Dynamic | Type-specific |
| Formatting | Custom transformers | Built-in specifiers |

## When to Use

Use **string-format** when:
- You prefer Python-style formatting
- You need to access object properties
- You want custom transformers
- You don't need precise numeric formatting

Use **printf-style** (`format()`) when:
- You need precise numeric formatting (padding, precision)
- You want C-style format strings
- You need binary/octal/hex output
- You want scientific notation

## Integration Example

Both styles can coexist in your project:

```typescript
import { format } from '../format'; // Printf-style
import { stringFormat } from '../stringFormat'; // Python-style

// Printf-style: precise numeric formatting
const price = format('Price: $%.2f', 19.99);
// => 'Price: $19.99'

// Python-style: object properties
const product = { name: 'Widget', price: 19.99 };
const desc = stringFormat('{name} costs ${price}', product);
// => 'Widget costs $19.99'
```

## License

Apache-2.0 (original library also under Apache-2.0)
