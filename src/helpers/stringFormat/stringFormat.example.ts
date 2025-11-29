/**
 * Example: string-format usage
 *
 * Python-style string formatting with {} placeholders
 */

import { create, stringFormat } from './stringFormat';

if (require.main === module) {
    console.log('=== string-format Examples ===\n');

    // 1. Basic implicit numbering
    console.log('1. Implicit numbering:');
    console.log(stringFormat('Hello, {}!', 'Alice'));
    console.log(stringFormat('{}, you have {} unread message{}', 'Steve', 1, ''));
    console.log();

    // 2. Explicit numbering
    console.log('2. Explicit numbering:');
    console.log(stringFormat('{0}, you have {1} unread message{2}', 'Holly', 2, 's'));
    console.log(stringFormat("The name's {1}. {0} {1}.", 'James', 'Bond'));
    console.log();

    // 3. Escaped braces
    console.log('3. Escaped braces:');
    console.log(stringFormat('{{}} creates an empty {} in {}', 'dictionary', 'Python'));
    console.log(stringFormat('Use {{foo}} for {}', 'placeholders'));
    console.log();

    // 4. Object properties
    console.log('4. Object properties:');
    const bobby = { firstName: 'Bobby', lastName: 'Fischer' };
    const garry = { firstName: 'Garry', lastName: 'Kasparov' };
    console.log(stringFormat('{0.firstName} {0.lastName} vs. {1.firstName} {1.lastName}', bobby, garry));

    const repo = { owner: 'davidchambers', slug: 'string-format' };
    console.log(stringFormat('https://github.com/{owner}/{slug}', repo));
    console.log();

    // 5. Method invocation
    console.log('5. Method invocation:');
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
    console.log(stringFormat('{fullName} was born at precisely {dob.toISOString}', sheldon));
    console.log(stringFormat("I've always wanted to go to a goth club. {quip.toUpperCase}", sheldon));
    console.log();

    // 6. Nested properties
    console.log('6. Nested properties:');
    const user = {
        name: 'Alice',
        address: {
            city: 'Paris',
            country: 'France',
        },
        stats: {
            followers: 1234,
            following: 567,
        },
    };
    console.log(stringFormat('{name} lives in {address.city}, {address.country}', user));
    console.log(stringFormat('{name} has {stats.followers} followers and follows {stats.following} users', user));
    console.log();

    // 7. Custom transformers
    console.log('7. Custom transformers:');
    const fmt = create({
        upper: s => s.toUpperCase(),
        lower: s => s.toLowerCase(),
        escape: s => s.replace(/[&<>"'`]/g, (c: string) => `&#${c.charCodeAt(0)};`),
        trim: s => s.trim(),
        reverse: s => s.split('').reverse().join(''),
    });

    console.log(fmt('Hello, {!upper}!', 'alice'));
    console.log(fmt('Hello, {!lower}!', 'BOB'));
    console.log(fmt('Reversed: {!reverse}', 'hello'));
    console.log();

    // 8. Transformers with properties
    console.log('8. Transformers with properties:');
    const htmlData = {
        name: 'Anchor & Hope',
        url: 'http://anchorandhopesf.com/',
        description: '<script>alert("XSS")</script>',
    };
    console.log(fmt('<a href="{url!escape}">{name!escape}</a>', htmlData));
    console.log(fmt('<p>{description!escape}</p>', htmlData));
    console.log();

    // 9. Practical use cases
    console.log('9. Practical use cases:');

    // Email template
    const email = {
        to: 'john.doe@example.com',
        subject: 'Meeting Reminder',
        date: new Date('2025-01-15T14:00:00'),
    };
    console.log(stringFormat('To: {to}\nSubject: {subject}\nDate: {date.toLocaleString}', email));
    console.log();

    // Log message
    const logData = {
        level: 'ERROR',
        timestamp: new Date(),
        message: 'Connection failed',
        code: 500,
    };
    console.log(stringFormat('[{level}] {timestamp.toISOString} - {message} (code: {code})', logData));
    console.log();

    // API URL builder
    const apiConfig = {
        protocol: 'https',
        host: 'api.example.com',
        version: 'v2',
        endpoint: 'users',
        id: 123,
    };
    console.log(stringFormat('{protocol}://{host}/{version}/{endpoint}/{id}', apiConfig));
    console.log();

    // 10. Error handling
    console.log('10. Error handling:');
    try {
        // Cannot mix implicit and explicit
        stringFormat('My name is {} {}. Do you like {0}?', 'Lemony', 'Snicket');
    } catch (error) {
        console.log('Error (expected):', (error as Error).message);
    }

    try {
        // Unknown transformer
        const badFmt = create({});
        badFmt('Hello {!missing}', 'world');
    } catch (error) {
        console.log('Error (expected):', (error as Error).message);
    }
}
