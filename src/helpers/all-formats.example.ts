/**
 * Example: All three formatting libraries in action
 *
 * Demonstrates when to use each library and how they can work together
 */

import { format } from './format';
import { create, stringFormat } from './stringFormat/stringFormat';

console.log('=== Formatting Libraries Comparison ===\n');

// Scenario 1: Financial report - need precise numeric formatting
console.log('1. Financial Report (use printf-style):');
const revenue = 1234567.89;
const expenses = 987654.32;
const profit = revenue - expenses;

console.log(format('Revenue:  $%12.2f', revenue));
console.log(format('Expenses: $%12.2f', expenses));
console.log(format('Profit:   $%12.2f', profit));
console.log(format('Margin:   %8.2f%%', (profit / revenue) * 100));
console.log();

// Scenario 2: User profile - working with objects
console.log('2. User Profile (use Python-style):');
const user = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 30,
    location: {
        city: 'Paris',
        country: 'France',
    },
    getFullLocation() {
        return `${this.location.city}, ${this.location.country}`;
    },
};

console.log(stringFormat('Name: {name}', user));
console.log(stringFormat('Email: {email}', user));
console.log(stringFormat('Age: {age}', user));
console.log(stringFormat('Location: {getFullLocation}', user));
console.log();

// Scenario 3: Scientific data - need precise formatting
console.log('3. Scientific Data (use printf-style):');
const experiments = [
    { name: 'Exp-001', value: 0.0001234, error: 0.0000012 },
    { name: 'Exp-002', value: 123.456789, error: 1.234567 },
    { name: 'Exp-003', value: 1234567890, error: 12345678 },
];

console.log('Experiment | Value            | Error           | Relative Error');
console.log('-----------+------------------+-----------------+---------------');
for (const exp of experiments) {
    const relError = (exp.error / exp.value) * 100;
    console.log(format('%-10s | %16.8e | %15.8e | %12.4f%%', exp.name, exp.value, exp.error, relError));
}
console.log();

// Scenario 4: HTML template - need escaping
console.log('4. HTML Template (use Python-style with transformers):');
const htmlFormat = create({
    escape: (s: string) => s.replace(/[&<>"'`]/g, (c: string) => `&#${c.charCodeAt(0)};`),
    upper: (s: string) => s.toUpperCase(),
});

const article = {
    title: 'Breaking: "AI & Robotics" Conference',
    author: 'John <script>alert()</script> Doe',
    content: 'This is safe content with <tags>',
};

console.log(htmlFormat('<h1>{title!escape}</h1>', article));
console.log(htmlFormat('<p>By {author!escape}</p>', article));
console.log(htmlFormat('<div>{content!escape}</div>', article));
console.log();

// Scenario 5: Log messages - combine both styles
console.log('5. Log Messages (combine both):');
const logEntry = {
    level: 'INFO',
    timestamp: new Date('2025-01-15T10:30:45.123Z'),
    user: { id: 12345, name: 'Bob' },
    duration: 0.123456,
    memory: 1234567,
};

// Use Python-style for structured data
const logPrefix = stringFormat('[{level}] {timestamp.toISOString} User:{user.id}', logEntry);

// Use printf-style for precise numbers
const logMetrics = format('duration=%.3fs memory=%dKB', logEntry.duration, Math.floor(logEntry.memory / 1024));

console.log(`${logPrefix} - ${logMetrics}`);
console.log();

// Scenario 6: Data table - use printf for alignment
console.log('6. Data Table (use printf-style for alignment):');
const products = [
    { id: 1, name: 'Widget', price: 19.99, stock: 100 },
    { id: 42, name: 'Gadget', price: 149.5, stock: 25 },
    { id: 999, name: 'Doohickey', price: 5.0, stock: 1000 },
];

console.log('ID   | Product    | Price     | Stock');
console.log('-----+------------+-----------+------');
for (const p of products) {
    console.log(format('%-4d | %-10s | $%8.2f | %5d', p.id, p.name, p.price, p.stock));
}
console.log();

// Scenario 7: API URL builder - use Python-style
console.log('7. API URL Builder (use Python-style):');
const apiRequest = {
    protocol: 'https',
    host: 'api.example.com',
    version: 'v2',
    endpoint: 'users',
    params: {
        id: 123,
        format: 'json',
    },
};

console.log(stringFormat('{protocol}://{host}/{version}/{endpoint}/{params.id}?format={params.format}', apiRequest));
console.log();

// Scenario 8: Binary/Hex debugging - use printf-style
console.log('8. Binary/Hex Debugging (use printf-style):');
const flags = 0b10110101;
const color = 0xff5733;

console.log(format('Flags: 0b%b (%d decimal)', flags, flags));
console.log(format('Color: #%06X (rgb: %d, %d, %d)', color, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff));
console.log();

// Scenario 9: Email template - use Python-style
console.log('9. Email Template (use Python-style):');
const emailData = {
    recipient: { name: 'Jane', email: 'jane@example.com' },
    sender: { name: 'Support Team' },
    order: {
        id: 'ORD-12345',
        total: 99.99,
        items: 3,
        date: new Date('2025-01-15'),
    },
};

const template = `
To: {recipient.name} <{recipient.email}>
From: {sender.name}

Dear {recipient.name},

Your order {order.id} has been confirmed!
Total: ${format('$%.2f', emailData.order.total)}
Items: {order.items}
Date: {order.date.toLocaleDateString}

Thank you for your purchase!
`;

console.log(stringFormat(template.trim(), emailData));
console.log();

// Scenario 10: Performance metrics - combine both
console.log('10. Performance Metrics (combine both):');
const metrics = {
    operation: 'database_query',
    timestamp: new Date(),
    stats: {
        queries: 12345,
        avgTime: 0.0234567,
        maxTime: 1.234567,
        errors: 3,
    },
};

console.log(stringFormat('Operation: {operation}', metrics));
console.log(stringFormat('Timestamp: {timestamp.toISOString}', metrics));
console.log(stringFormat('Total queries: {stats.queries}', metrics));
console.log(format('Average time: %.3f ms', metrics.stats.avgTime * 1000));
console.log(format('Max time: %.3f ms', metrics.stats.maxTime * 1000));
console.log(format('Error rate: %.2f%%', (metrics.stats.errors / metrics.stats.queries) * 100));
