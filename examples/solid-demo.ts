/**
 * Practical demonstration of SOLID principles compliance
 * in ffs2-logger with concrete examples of extensibility
 */

import {
    AAsyncBatchAppender,
    LOGGER_SERVICE,
    lazyFormatterRegistry,
    logEventPool,
    type ILoggerAppender,
    type LogLevel
} from '../src/index';
import type { LogEvent } from '../src/types/LogEvent';

// ==========================================
// CLASSES FOR DEMONSTRATION
// ==========================================

// Extension 2: New appender via inheritance
class MemoryAppender extends AAsyncBatchAppender {
    private logs: string[] = [];

    constructor() {
        super({
            maxBatchSize: 5,
            maxWaitTime: 1000
        }, 'MemoryAppender');
    }

    protected async processBatch(events: LogEvent[]): Promise<void> {
        for (const event of events) {
            this.logs.push(`${event.level}: ${event.message}`);
        }
    }

    getLogs(): string[] {
        return [...this.logs];
    }

    clear(): void {
        this.logs = [];
    }
}

// Creation of a class that depends on abstractions
class SOLIDLogger {
    constructor(
        private service: typeof LOGGER_SERVICE,  // ILoggerService Interface
        private pool: typeof logEventPool,       // Pool Interface
        private registry: typeof lazyFormatterRegistry // Registry Interface
    ) { }

    async logWithOptimizations(level: LogLevel, message: string, data?: unknown) {
        // Uses the object pool
        const event = this.pool.acquire();

        try {
            event.level = level;
            event.message = message;
            event.timestamp = Date.now();
            event.data = data;
            event.context = 'SOLID-demo';

            // Uses the lazy-loaded formatter
            const formatter = this.registry.getFormatter('json-pretty');
            if (formatter) {
                event.message = formatter(message, data);
            }

            // Uses the logger service
            const logger = this.service.createLogger('SOLIDDemo');
            await logger.sendEvent(event);

        } finally {
            // Returns to the pool
            this.pool.release(event);
        }
    }
}

// ==========================================
// SOLID PRINCIPLES DEMONSTRATION
// ==========================================

async function demonstrateSOLID() {
    console.log('🏗️ SOLID Architecture Demonstration - ffs2-logger\n');

    // ==========================================
    // 1. SINGLE RESPONSIBILITY PRINCIPLE
    // ==========================================
    console.log('📋 1. Single Responsibility Principle');

    // ✅ Each class has ONE clear responsibility
    console.log('✅ Object Pool - ONLY pooling:');
    console.log('   Pool stats:', logEventPool.getStats());

    console.log('✅ Lazy Registry - ONLY lazy loading:');
    console.log('   Available Formatters:', lazyFormatterRegistry.getAvailableFormatters());
    console.log('   Registry stats:', lazyFormatterRegistry.getStats());

    console.log('✅ LoggerService - ONLY logger management:');
    console.log('   Number of appenders:', LOGGER_SERVICE.listAppenders().length);
    console.log('');

    // ==========================================
    // 2. OPEN/CLOSED PRINCIPLE
    // ==========================================
    console.log('🔓 2. Open/Closed Principle - Extension without modification');

    // Extension 1: New formatter without modifying existing code
    console.log('✅ Extension 1: New JSON formatter');
    lazyFormatterRegistry.registerFormatter('json-pretty', () => {
        return (message: string, data?: unknown) => {
            return JSON.stringify({
                message,
                data,
                timestamp: new Date().toISOString()
            }, null, 2);
        };
    });

    const jsonFormatter = lazyFormatterRegistry.getFormatter('json-pretty');
    if (jsonFormatter) {
        const result = jsonFormatter('Test message', { userId: 123 });
        console.log('   Formatter result preview:', result.substring(0, 50) + '...');
    }

    // Extension 2: New appender via inheritance
    console.log('✅ Extension 2: New Memory appender without modification');

    const memoryAppender = new MemoryAppender();
    await memoryAppender.initialize();
    console.log('   Memory appender created and initialized');
    console.log('');

    // ==========================================
    // 3. LISKOV SUBSTITUTION PRINCIPLE
    // ==========================================
    console.log('🔄 3. Liskov Substitution Principle - Perfect substitutability');

    // All appender implementations are perfectly substitutable
    const testAppenders: ILoggerAppender[] = [
        memoryAppender,
        // All respect the same ILoggerAppender contract
    ];

    console.log('✅ Substitution test:');
    for (const appender of testAppenders) {
        // Same interface for all
        console.log(`   - ${appender.constructor.name}: Level=${appender.getLogLevel()}, Initialized=${appender.isInitialized()}`);

        // Identical behavior guaranteed
        const testEvent: LogEvent = {
            level: 'info',
            message: 'Test substitution',
            timestamp: Date.now(),
            context: 'SOLID-test'
        };

        await appender.append(testEvent);
    }

    // Verification that MemoryAppender received the log
    console.log('   Memory logs received:', memoryAppender.getLogs());
    console.log('');

    // ==========================================
    // 4. INTERFACE SEGREGATION PRINCIPLE
    // ==========================================
    console.log('🧩 4. Interface Segregation Principle - Specialized Interfaces');

    // Clients only use the interfaces they need
    function logLevelChecker(provider: { getLogLevel(): LogLevel }) {
        // Minimal interface - just getLogLevel
        return provider.getLogLevel();
    }

    function lifecycleManager(component: { initialize(): void; isInitialized(): boolean }) {
        // Minimal interface - just lifecycle
        if (!component.isInitialized()) {
            component.initialize();
        }
        return 'Lifecycle managed';
    }

    function identifierChecker(component: { getSymbolIdentifier(): symbol }) {
        // Minimal interface - just identifier
        return component.getSymbolIdentifier().toString();
    }

    console.log('✅ Use of specialized interfaces:');
    console.log(`   - LogLevel checker: ${logLevelChecker(LOGGER_SERVICE)}`);
    console.log(`   - Lifecycle manager: ${lifecycleManager(memoryAppender)}`);
    console.log(`   - Identifier: ${identifierChecker(memoryAppender).substring(0, 30)}...`);
    console.log('');

    // ==========================================
    // 5. DEPENDENCY INVERSION PRINCIPLE  
    // ==========================================
    console.log('⬆️ 5. Dependency Inversion Principle - Dependency on abstractions');

    // ✅ Dependency Injection (abstractions)
    const solidLogger = new SOLIDLogger(
        LOGGER_SERVICE,           // ILoggerService Abstraction
        logEventPool,            // Pool Abstraction
        lazyFormatterRegistry    // Registry Abstraction
    );

    console.log('✅ SOLID Logger created with dependency injection');

    // Adding memory appender to see the result
    LOGGER_SERVICE.addAppender(memoryAppender);

    // Logging test with all optimizations
    await solidLogger.logWithOptimizations('info', 'SOLID Message', {
        principle: 'Dependency Inversion',
        working: true
    });

    console.log('✅ Log with optimizations sent');
    await memoryAppender.forceFlush();

    console.log('   Final Memory logs:', memoryAppender.getLogs());
    console.log('');

    // ==========================================
    // SOLID ARCHITECTURE SUMMARY
    // ==========================================
    console.log('🎯 SUMMARY - SOLID Architecture');
    console.log('✅ S - Single Responsibility: Each class has a clear responsibility');
    console.log('✅ O - Open/Closed: Easy extension via interfaces and inheritance');
    console.log('✅ L - Liskov Substitution: Implementations perfectly substitutable');
    console.log('✅ I - Interface Segregation: Atomic and specialized interfaces');
    console.log('✅ D - Dependency Inversion: Dependency on abstractions');

    console.log('\n📊 Final Stats:');
    console.log('   Pool stats:', logEventPool.getStats());
    console.log('   Registry stats:', lazyFormatterRegistry.getStats());
    console.log('   Memory appender stats:', memoryAppender.getStats());

    // Cleanup
    await memoryAppender.destroy();
    console.log('\n✅ SOLID Demonstration successfully completed! 🚀');
}

// Run the demonstration
demonstrateSOLID().catch(console.error);

export { MemoryAppender, SOLIDLogger };
