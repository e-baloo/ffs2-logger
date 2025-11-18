/**
 * Example demonstrating the performance optimizations:
 * - Lazy loading formatters
 * - Object pooling for LogEvent
 * - Async batch appending
 */

import { LOGGER_SERVICE } from '../src/index';
import { logEventPool } from '../src/helpers/LogEventPool';
import { lazyFormatterRegistry } from '../src/helpers/LazyFormatterRegistry';
import { FileAsyncBatchAppender } from '../src/appenders/FileAsyncBatchAppender';

async function performanceOptimizationExample() {
    console.log('🚀 Performance Optimization Demo\n');

    // ==========================================
    // 1. LAZY LOADING FORMATTERS
    // ==========================================
    console.log('📦 1. Lazy Loading Formatters');

    // Get available formatter names
    const formatterNames = lazyFormatterRegistry.getAvailableFormatters();
    console.log('Available formatters:', formatterNames);

    // Formatters are only loaded when first used
    const printfFormatter = lazyFormatterRegistry.getFormatter('printf');
    console.log('printf formatter loaded:', !!printfFormatter);

    // Test lazy-loaded formatter
    if (printfFormatter) {
        const result = printfFormatter('Hello %s! You are %d years old.', 'Alice', 30);
        console.log('Formatted message:', result);
    }
    console.log('');

    // ==========================================
    // 2. OBJECT POOLING
    // ==========================================
    console.log('🏊 2. Object Pooling for LogEvent');

    // Get initial pool stats
    console.log('Initial pool stats:', logEventPool.getStats());

    // Acquire pooled log events
    const event1 = logEventPool.acquire();
    event1.level = 'info';
    event1.message = 'Pooled log event 1';
    event1.timestamp = Date.now();
    event1.context = 'demo';

    const event2 = logEventPool.acquire();
    event2.level = 'warn';
    event2.message = 'Pooled log event 2';
    event2.timestamp = Date.now();
    event2.context = 'demo';

    console.log('After acquiring 2 events:', logEventPool.getStats());

    // Use events
    console.log('Event 1:', event1.message);
    console.log('Event 2:', event2.message);

    // Return to pool
    logEventPool.release(event1);
    logEventPool.release(event2);

    console.log('After releasing events:', logEventPool.getStats());
    console.log('');

    // ==========================================
    // 3. ASYNC BATCH APPENDER
    // ==========================================
    console.log('📝 3. Async Batch Appender');

    // Create batch appender with small batch size for demo
    const batchAppender = new FileAsyncBatchAppender({
        filePath: './performance-demo.log',
        maxBatchSize: 3,        // Small for demo
        maxWaitTime: 500,       // 500ms max wait
        maxMemoryUsage: 1024,   // 1KB for demo
        enableRetry: true,
        maxRetries: 2,
        append: true
    });

    await batchAppender.initialize();
    console.log('Batch appender initialized');

    // Use the existing logger service
    const logger = LOGGER_SERVICE;
    logger.addAppender(batchAppender);

    // Log multiple events quickly - they will be batched
    console.log('Logging 5 events quickly...');
    for (let i = 1; i <= 5; i++) {
        const pooledEvent = logEventPool.acquire();
        pooledEvent.level = 'info';
        pooledEvent.message = `Batched message ${i}`;
        pooledEvent.timestamp = Date.now();
        pooledEvent.context = 'batch-demo';

        await batchAppender.append(pooledEvent);
        console.log(`  Event ${i} added to batch`);
    }

    // Check stats before flush
    console.log('Batch stats before flush:', batchAppender.getStats());

    // Force flush to see results
    await batchAppender.forceFlush();
    console.log('Batch flushed!');

    // Final stats
    console.log('Final batch stats:', batchAppender.getStats());
    console.log('Final pool stats:', logEventPool.getStats());

    // Cleanup
    await batchAppender.destroy();
    console.log('\n✅ Performance optimization demo complete!');
    console.log('Check performance-demo.log for batch output');
}

// ==========================================
// PERFORMANCE COMPARISON
// ==========================================
async function performanceComparison() {
    console.log('\n⏱️ Performance Comparison\n');

    const iterations = 1000;

    // Test 1: Traditional approach (no pooling, no batching)
    console.log('🐌 Traditional approach...');
    const start1 = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
        const event = {
            level: 'info' as const,
            message: `Traditional message ${i}`,
            timestamp: Date.now(),
            context: 'perf-test'
        };
        // Simulate processing
        JSON.stringify(event);
    }

    const end1 = process.hrtime.bigint();
    const traditional = Number(end1 - start1) / 1000000; // Convert to ms

    // Test 2: With object pooling
    console.log('🏊 With object pooling...');
    const start2 = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
        const event = logEventPool.acquire();
        event.level = 'info';
        event.message = `Pooled message ${i}`;
        event.timestamp = Date.now();
        event.context = 'perf-test';

        // Simulate processing
        JSON.stringify(event);

        logEventPool.release(event);
    }

    const end2 = process.hrtime.bigint();
    const pooled = Number(end2 - start2) / 1000000; // Convert to ms

    console.log('\n📊 Results:');
    console.log(`Traditional approach: ${traditional.toFixed(2)}ms`);
    console.log(`With object pooling:  ${pooled.toFixed(2)}ms`);
    console.log(`Improvement:          ${((traditional - pooled) / traditional * 100).toFixed(1)}%`);

    console.log('\n📈 Pool efficiency:', logEventPool.getStats());
}

// Run the demo
async function main() {
    try {
        await performanceOptimizationExample();
        await performanceComparison();
    } catch (error) {
        console.error('Demo failed:', error);
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

export {
    performanceOptimizationExample,
    performanceComparison
};