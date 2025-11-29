/**
 * Example: Integration of formatTokenize and formatInterpolate
 *
 * This demonstrates how to use both libraries together to create
 * a complete printf-style string formatting solution.
 */

import { format } from './format';

// Example usage
if (require.main === module) {
    console.log('\n=== Printf-Style Formatting Examples ===\n');

    // Basic string formatting
    console.log('1. Basic string:');
    console.log(format('Hello %s!', 'World'));
    console.log(format('Name: %s, Age: %d', 'Alice', 30));

    // Number formatting
    console.log('\n2. Number formatting:');
    console.log(format('Decimal: %d', 42));
    console.log(format('Hexadecimal: %x', 255));
    console.log(format('Binary: %b', 5));
    console.log(format('Octal: %o', 8));

    // Float formatting
    console.log('\n3. Float formatting:');
    console.log(format('Pi: %.2f', Math.PI));
    console.log(format('Scientific: %e', 1234.5));
    console.log(format('Compact: %g', 0.000123));

    // Width and padding
    console.log('\n4. Width and padding:');
    console.log(format('[%5d]', 42));
    console.log(format('[%-5d]', 42));
    console.log(format('[%05d]', 42));

    // Signs
    console.log('\n5. Signs:');
    console.log(format('%+d', 42));
    console.log(format('% d', 42));
    console.log(format('%+d', -42));

    // Alternate forms
    console.log('\n6. Alternate forms:');
    console.log(format('%#x', 255));
    console.log(format('%#o', 8));

    // Complex formatting
    console.log('\n7. Complex formatting:');
    console.log(format('Total: $%,.2f', 1234.5678));
    console.log(format('Hex: %#08x', 255));

    // Table-like output
    console.log('\n8. Table formatting:');
    console.log(format('%-10s %5d %8.2f', 'Alice', 30, 95.7));
    console.log(format('%-10s %5d %8.2f', 'Bob', 25, 87.3));
    console.log(format('%-10s %5d %8.2f', 'Charlie', 35, 92.1));

    // Escaped percent
    console.log('\n9. Escaped percent:');
    console.log(format('Progress: %d%%', 75));

    // Position mapping
    console.log('\n10. Position mapping:');
    console.log(format('%2$s %1$s', 'World', 'Hello'));

    // Special values
    console.log('\n11. Special values:');
    console.log(format('NaN: %f', Number.NaN));
    console.log(format('Infinity: %f', Number.POSITIVE_INFINITY));
    console.log(format('-Infinity: %f', Number.NEGATIVE_INFINITY));

    console.log('\n');
}
