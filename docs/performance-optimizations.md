# Performance Optimization Integration Guide

This guide explains how to use the performance optimizations implemented in ffs2-logger.

## 🚀 Available Optimizations

### 1. Lazy Loading of Formatters
Formatters are loaded on demand to reduce startup time and memory consumption.

### 2. Object Pool for LogEvent
Reuse of LogEvent objects to reduce allocations and pressure on the Garbage Collector.

### 3. Async Appenders with Batching
Batch processing of log events to improve the performance of asynchronous appenders.

## 📦 1. Lazy Loading of Formatters

### Basic Usage
```typescript
import { lazyFormatterRegistry } from '@ffs2/logger';

// See available formatters
const available = lazyFormatterRegistry.getAvailableFormatters();
console.log('Formatters:', available); // ['printf']

// Get a formatter (loaded on demand)
const printf = lazyFormatterRegistry.getFormatter('printf');
if (printf) {
    const result = printf('Hello %s!', 'World');
    console.log(result); // "Hello World!"
}
```

### Registering Your Own Formatters
```typescript
// Register a custom formatter (factory pattern)
lazyFormatterRegistry.registerFormatter('custom', () => {
    return (template: string, ...args: any[]) => {
        // Your custom formatting logic
        return template.replace(/{(\d+)}/g, (match, number) => {
            return args[number] !== undefined ? args[number] : match;
        });
    };
});

// Use the custom formatter
const customFormatter = lazyFormatterRegistry.getFormatter('custom');
const result = customFormatter?.('{0} is {1} years old', 'Alice', 30);
// "Alice is 30 years old"
```

### Registering Transformers
```typescript
// Register transformers for formatting
lazyFormatterRegistry.registerTransformers('markdown', () => ({
    bold: (text: string) => `**${text}**`,
    italic: (text: string) => `*${text}*`,
    code: (text: string) => \`\`\`${text}\`\`\`,
}));

const mdTransformers = lazyFormatterRegistry.getTransformers('markdown');
console.log(mdTransformers?.bold('Important')); // "**Important**"
```

## 🏊 2. LogEvent Object Pool

### Basic Usage
```typescript
import { logEventPool } from '@ffs2/logger';

// Acquire an object from the pool
const event = logEventPool.acquire();

// Configure the event
event.level = 'info';
event.message = 'Important message';
event.timestamp = Date.now();
event.context = 'my-service';
event.data = { userId: 123, action: 'login' };

// Use the event
console.log(event.message);

// IMPORTANT: Return the object to the pool after use
logEventPool.release(event);
```

### Recommended Pattern with try/finally
```typescript
async function logWithPooling(level: string, message: string, data?: any) {
    const event = logEventPool.acquire();
    
    try {
        event.level = level;
        event.message = message;
        event.timestamp = Date.now();
        event.data = data;
        
        // Process the event
        await someAppender.append(event);
        
    } finally {
        // Always return to the pool
        logEventPool.release(event);
    }
}
```

### Pool Monitoring
```typescript
// Get statistics
const stats = logEventPool.getStats();
console.log('Pool stats:', {
    poolSize: stats.poolSize,        // Available objects
    maxPoolSize: stats.maxPoolSize,  // Max pool size
    created: stats.created,          // Objects created
    reused: stats.reused,           // Objects reused
    hitRate: stats.hitRate          // Reuse rate
});

// Prewarm the pool (optional)
logEventPool.prewarm(20); // Create 20 objects in advance
```

## 📝 3. Async Appenders with Batching

### Basic Configuration
```typescript
import { FileAsyncBatchAppender } from '@ffs2/logger';

const batchAppender = new FileAsyncBatchAppender({
    filePath: './logs/app.log',
    maxBatchSize: 100,          // Max 100 events per batch
    maxWaitTime: 1000,          // Max 1s wait
    maxMemoryUsage: 1024 * 1024, // Max 1MB in memory
    enableRetry: true,          // Retry on error
    maxRetries: 3,              // Max 3 attempts
    append: true                // Append to existing file
});

// Initialize the appender
await batchAppender.initialize();
```

### Integration with Logger
```typescript
import { LOGGER_SERVICE } from '@ffs2/logger';

// Add the appender to the logger service
LOGGER_SERVICE.addAppender(batchAppender);

// Logs are automatically batched
LOGGER_SERVICE.info('Message 1');
LOGGER_SERVICE.info('Message 2');
LOGGER_SERVICE.info('Message 3');
// These 3 messages can be processed in a single batch
```

### Custom Appender with Batching
```typescript
import { AsyncBatchAppender, type LogEvent } from '@ffs2/logger';

export class DatabaseBatchAppender extends AsyncBatchAppender {
    constructor(private connectionString: string) {
        super({
            maxBatchSize: 50,
            maxWaitTime: 2000,
            enableRetry: true,
            maxRetries: 2
        }, 'DatabaseBatchAppender');
    }

    protected async processBatch(events: LogEvent[]): Promise<void> {
        // Implement your processing logic
        const statements = events.map(event => ({
            level: event.level,
            message: event.message,
            timestamp: new Date(event.timestamp),
            context: event.context,
            data: JSON.stringify(event.data)
        }));

        // Insert into database in a single query
        await this.insertBatch(statements);
    }

    private async insertBatch(statements: any[]): Promise<void> {
        // Your database insertion logic
        console.log(\`Inserting \${statements.length} log entries\`);
    }
}
```

### Performance Monitoring
```typescript
// Get performance stats
const stats = batchAppender.getStats();
console.log('Batch performance:', {
    totalEvents: stats.totalEvents,     // Events processed
    batchesFlushed: stats.batchesFlushed, // Batches processed
    avgBatchSize: stats.avgBatchSize,   // Average batch size
    pendingEvents: stats.pendingEvents, // Events pending
    errors: stats.errors,               // Errors encountered
    retries: stats.retries,             // Retry attempts
    config: stats.config                // Current configuration
});

// Force a flush (for tests or shutdown)
await batchAppender.forceFlush();
```

## 🔄 Complete Integration

Here is an example of complete integration of the three optimizations:

```typescript
import { 
    LOGGER_SERVICE, 
    logEventPool, 
    lazyFormatterRegistry,
    FileAsyncBatchAppender 
} from '@ffs2/logger';

// Optimized logging system setup
export async function setupOptimizedLogging() {
    // 1. Configure custom formatters
    lazyFormatterRegistry.registerFormatter('json', () => {
        return (message: string, data?: any) => {
            return JSON.stringify({ message, data, timestamp: new Date() });
        };
    });

    // 2. Prewarm the object pool
    logEventPool.prewarm(50);

    // 3. Configure the appender with batching
    const batchAppender = new FileAsyncBatchAppender({
        filePath: './logs/app-optimized.log',
        maxBatchSize: 50,
        maxWaitTime: 1000,
        enableRetry: true,
        formatter: (event) => {
            // Use the lazy-loaded formatter
            const jsonFormatter = lazyFormatterRegistry.getFormatter('json');
            return jsonFormatter ? 
                jsonFormatter(event.message, event.data) : 
                \`\${event.level}: \${event.message}\`;
        }
    });

    await batchAppender.initialize();
    LOGGER_SERVICE.addAppender(batchAppender);

    return { batchAppender };
}

// Optimized log function
export async function logOptimized(
    level: 'info' | 'warn' | 'error', 
    message: string, 
    data?: any
) {
    const event = logEventPool.acquire();
    
    try {
        event.level = level;
        event.message = message;
        event.timestamp = Date.now();
        event.data = data;
        
        await LOGGER_SERVICE.append(event);
    } finally {
        logEventPool.release(event);
    }
}

// Usage
async function main() {
    const { batchAppender } = await setupOptimizedLogging();
    
    // Optimized logging
    await logOptimized('info', 'Application started', { version: '1.0.0' });
    await logOptimized('info', 'User logged in', { userId: 123 });
    
    // Cleanup on shutdown
    process.on('SIGTERM', async () => {
        await batchAppender.destroy();
        console.log('Logging system shut down gracefully');
        process.exit(0);
    });
}
```

## 📊 Expected Performance Gains

- **Lazy Loading**: -20% to -40% startup time depending on the number of formatters
- **Object Pooling**: -30% to -60% memory allocations in steady state  
- **Async Batching**: -50% to -80% I/O operations depending on configuration

## ⚠️ Best Practices

1. **Object Pool**: Always call `release()` after use
2. **Batching**: Adjust `maxBatchSize` and `maxWaitTime` according to your needs
3. **Monitoring**: Monitor stats to optimize parameters
4. **Cleanup**: Call `destroy()` on appenders before shutdown
5. **Tests**: Use `forceFlush()` for synchronous tests

## 🔧 Debugging

```typescript
// Log performance
setInterval(() => {
    console.log('Pool stats:', logEventPool.getStats());
    console.log('Registry stats:', lazyFormatterRegistry.getStats());
    console.log('Batch stats:', batchAppender.getStats());
}, 30000); // Every 30 seconds
```