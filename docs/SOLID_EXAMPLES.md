# Practical SOLID Examples in ffs2-logger

This document presents concrete examples of applying SOLID principles in the ffs2-logger project.

## 🎯 Single Responsibility Principle (SRP)

### ✅ Positive Example: Clear Separation of Responsibilities

```typescript
// ✅ GOOD PRACTICE - Each class has ONE responsibility

// Responsibility: Log Level Management ONLY
export class LogLevelProvider implements ILogLevelProvider {
    private level: LogLevel;
    
    getLogLevel(): LogLevel { /* ... */ }
    logLevelPriority(level: LogLevel): number { /* ... */ }
    isLogLevelEnabled(current: LogLevel, target: LogLevel): boolean { /* ... */ }
}

// Responsibility: Object Pool ONLY  
export class LogEventPool {
    private pool: PoolableLogEvent[] = [];
    
    acquire(): PoolableLogEvent { /* ... */ }
    release(event: PoolableLogEvent): void { /* ... */ }
    getStats(): PoolStats { /* ... */ }
}

// Responsibility: Registry with Lazy Loading ONLY
export class LazyFormatterRegistry {
    private formatters = new Map<string, FormatFunction>();
    
    registerFormatter(name: string, factory: FormatterFactory): void { /* ... */ }
    getFormatter(name: string): FormatFunction | null { /* ... */ }
}
```

### ⚠️ Improvement Point: ConsoleAppender

```typescript
// ⚠️ POSSIBLE IMPROVEMENT - ConsoleAppender does 2 things
export class ConsoleAppender implements ILoggerAppender {
    // Responsibility 1: Event Formatting
    protected formatEvent(event: LogEvent): string { /* ... */ }
    protected formatLogLevel(event: LogEvent): string { /* ... */ }
    protected formatDate(event: LogEvent): string { /* ... */ }
    
    // Responsibility 2: Display/Rendering
    protected printMessages(event: LogEvent): void { /* ... */ }
    private printData(event: LogEvent): void { /* ... */ }
    private printError(event: LogEvent): void { /* ... */ }
}

// 🔄 IMPROVEMENT SUGGESTION
export interface ILogEventFormatter {
    format(event: LogEvent): FormattedLogEvent;
}

export interface ILogEventRenderer {
    render(formatted: FormattedLogEvent): void;
}

export class ConsoleAppender implements ILoggerAppender {
    constructor(
        private formatter: ILogEventFormatter,
        private renderer: ILogEventRenderer
    ) {}
    
    async append(events: LogEvent[]): Promise<void> {
        for (const event of events) {
            const formatted = this.formatter.format(event);
            this.renderer.render(formatted);
        }
    }
}
```

## 🔓 Open/Closed Principle (OCP)

### ✅ Excellent Example: AsyncBatchAppender

```typescript
// ✅ EXCELLENT PRACTICE - Closed to modification, open to extension
export abstract class AsyncBatchAppender implements ILoggerAppender {
    // Stable code, closed to modification
    protected batch: LogEvent[] = [];
    protected stats: BatchStats;
    
    async append(message: LogEvent | LogEvent[]): Promise<void> {
        // Stable batching logic
        const events = Array.isArray(message) ? message : [message];
        for (const event of events) {
            await this.addToBatch(event);
        }
    }
    
    protected async flush(): Promise<void> {
        // Stable flush logic
        if (this.batch.length === 0) return;
        
        const batchToFlush = [...this.batch];
        this.batch = [];
        
        try {
            await this.processBatch(batchToFlush); // Extension point
        } catch (error) {
            // Stable error handling
        }
    }
    
    // Extension point - open to new behaviors
    protected abstract processBatch(events: LogEvent[]): Promise<void>;
}

// Extension 1: File
export class FileAsyncBatchAppender extends AsyncBatchAppender {
    protected async processBatch(events: LogEvent[]): Promise<void> {
        const content = events.map(e => this.formatEvent(e)).join('\n');
        await appendFile(this.filePath, content);
    }
}

// Extension 2: Database (without modifying AsyncBatchAppender)
export class DatabaseBatchAppender extends AsyncBatchAppender {
    protected async processBatch(events: LogEvent[]): Promise<void> {
        await this.database.insertBatch(events);
    }
}

// Extension 3: REST API (without modifying AsyncBatchAppender)
export class ApiBatchAppender extends AsyncBatchAppender {
    protected async processBatch(events: LogEvent[]): Promise<void> {
        await fetch('/api/logs', {
            method: 'POST',
            body: JSON.stringify(events)
        });
    }
}
```

### ✅ Extension via Registry Pattern

```typescript
// ✅ Extension of formatters without modifying existing code
const registry = lazyFormatterRegistry;

// Extension 1: JSON Formatter
registry.registerFormatter('json', () => {
    return (template: string, data: any) => JSON.stringify({ template, data });
});

// Extension 2: XML Formatter  
registry.registerFormatter('xml', () => {
    return (template: string, data: any) => 
        \`<log><template>\${template}</template><data>\${JSON.stringify(data)}</data></log>\`;
});

// Extension 3: Custom Transformer
registry.registerTransformers('security', () => ({
    mask: (value: string) => '*'.repeat(value.length),
    hash: (value: string) => require('crypto').createHash('sha256').update(value).digest('hex'),
    redact: (obj: any) => ({ ...obj, password: '[REDACTED]', token: '[REDACTED]' })
}));

// Usage - client code unchanged
const formatter = registry.getFormatter('json');
const xmlFormatter = registry.getFormatter('xml');
```

## 🔄 Liskov Substitution Principle (LSP)

### ✅ Perfect Substitution of Appenders

```typescript
// ✅ EXCELLENT PRACTICE - All appenders are substitutable
export function setupLogging(appenders: ILoggerAppender[]) {
    const service = new LoggerService();
    
    // All perfectly respect the ILoggerAppender contract
    for (const appender of appenders) {
        await appender.initialize(); // Contract respected
        service.addAppender(appender); // Perfect substitution
    }
    
    return service;
}

// Usage - perfectly interchangeable
const configs = [
    // Configuration 1: Console only
    [new ConsoleAppender(service)],
    
    // Configuration 2: Console + File with batching
    [
        new ConsoleAppender(service),
        new FileAsyncBatchAppender({ filePath: './app.log', maxBatchSize: 100 })
    ],
    
    // Configuration 3: All appenders
    [
        new ConsoleAppender(service),
        new FileAsyncBatchAppender({ filePath: './app.log', maxBatchSize: 100 }),
        new DatabaseBatchAppender({ connectionString: 'db://...' })
    ]
];

// All work identically - LSP respected
for (const config of configs) {
    const service = await setupLogging(config);
    service.createLogger('test').info('Test message');
}
```

### ✅ Substitution of Providers

```typescript
// ✅ Interchangeable Providers
export class CustomLogLevelProvider implements ILogLevelProvider {
    getLogLevel(): LogLevel { return 'debug'; }
    logLevelPriority(level: LogLevel): number { /* custom logic */ }
    isLogLevelEnabled(current: LogLevel, target: LogLevel): boolean { /* custom logic */ }
}

// Transparent substitution
const standardService = new LoggerService(new LogLevelProvider());
const customService = new LoggerService(new CustomLogLevelProvider());

// Same interface, guaranteed behavior
const logger1 = standardService.createLogger('test1');
const logger2 = customService.createLogger('test2'); 
// Both perfectly respect the contract
```

## 🧩 Interface Segregation Principle (ISP)

### ✅ Atomic and Composable Interfaces

```typescript
// ✅ EXCELLENT PRACTICE - Fine and specialized interfaces

// Atomic Interface 1: Identification
export interface ISymbolIdentifier {
    getSymbolIdentifier(): symbol;
}

// Atomic Interface 2: Log Level (Read Only)
export interface IGetterLogLevel {
    getLogLevel(): LogLevel;
}

// Atomic Interface 3: Log Level (Write Only)
export interface ISetterLogLevel {
    setLogLevel(level: LogLevel): void;
}

// Atomic Interface 4: Lifecycle
export interface ILifecycle {
    initialize(): void;
    destroy(): void;
    isInitialized(): boolean;
}

// Atomic Interface 5: Level Check
export interface IisLogLevelEnabled {
    isLogLevelEnabled(currentLevel: LogLevel, targetLevel: LogLevel): boolean;
}

// Composition according to exact needs
export interface ILogLevel extends IGetterLogLevel, ISetterLogLevel {} // Just get/set

export interface ILoggerAppender extends 
    ILifecycle,        // Needs lifecycle
    ISymbolIdentifier, // Needs identification
    ILogLevel {        // Needs level management
    append(message: LogEvent | LogEvent[]): Promise<void>;
}

export interface ILogLevelProvider extends IisLogLevelEnabled {
    getLogLevel(): LogLevel;
    logLevelPriority(level: LogLevel): number;
}
```

### ✅ Clients Implement Only What They Need

```typescript
// Client 1: Just needs to read the level
class LogLevelChecker {
    constructor(private provider: IGetterLogLevel) {} // Minimal interface
    
    check(): boolean {
        return this.provider.getLogLevel() === 'debug';
    }
}

// Client 2: Just needs identification
class AppenderRegistry {
    private appenders = new Map<symbol, ILoggerAppender>();
    
    register(appender: ISymbolIdentifier) { // Minimal interface
        this.appenders.set(appender.getSymbolIdentifier(), appender as any);
    }
}

// Client 3: Needs lifecycle only
class LifecycleManager {
    async initializeAll(components: ILifecycle[]) { // Minimal interface
        for (const component of components) {
            if (!component.isInitialized()) {
                await component.initialize();
            }
        }
    }
}
```

## ⬆️ Dependency Inversion Principle (DIP)

### ✅ Dependency on Abstractions

```typescript
// ✅ EXCELLENT PRACTICE - Dependency on interfaces

// High-level class depends on abstraction
export class LoggerService implements ILoggerService {
    constructor(
        private levelProvider: ILogLevelProvider = new LogLevelProvider() // Abstraction
    ) {
        this.level = this.levelProvider.getLogLevel();
    }
    
    createLogger(context: string): ILogger {
        // Depends on ILogger interface, not concrete Logger
        const logger = new Logger(context, this, this.appenders);
        return logger; // Returns interface
    }
}

// Logger depends on abstractions
export class Logger extends ALogger {
    constructor(
        context: string,
        service: ILoggerService,     // Abstraction
        appenders: ILoggerAppenders, // Abstraction  
        logLevel?: LogLevel
    ) {
        super(context, service, appenders, logLevel);
    }
}

// Appenders depend on abstractions
export class ConsoleAppender implements ILoggerAppender {
    constructor(private service: ILoggerService) {} // Abstraction, not LoggerService
}

export abstract class AsyncBatchAppender implements ILoggerAppender {
    // Uses PoolableLogEvent abstraction
    protected returnEventsToPool(events: LogEvent[]): void {
        for (const event of events) {
            if ('_inPool' in event && typeof event._inPool === 'boolean') {
                logEventPool.release(event as PoolableLogEvent); // Interface
            }
        }
    }
}
```

### ✅ Dependency Injection and Configuration

```typescript
// ✅ Externalized configuration respecting DIP
export interface ILoggerConfiguration {
    defaultLogLevel: LogLevel;
    appenders: ILoggerAppender[];
    levelProvider: ILogLevelProvider;
}

export class ConfigurableLoggerService extends LoggerService {
    constructor(config: ILoggerConfiguration) {
        super(config.levelProvider); // Injection of abstraction
        
        this.setLogLevel(config.defaultLogLevel);
        
        for (const appender of config.appenders) {
            this.addAppender(appender); // Interface, not implementation
        }
    }
}

// Usage - assembly of dependencies outside
const config: ILoggerConfiguration = {
    defaultLogLevel: 'info',
    levelProvider: new LogLevelProvider(),
    appenders: [
        new ConsoleAppender(service),
        new FileAsyncBatchAppender({
            filePath: './logs/app.log',
            maxBatchSize: 100
        })
    ]
};

const service = new ConfigurableLoggerService(config);
```

### 🔄 Suggested Improvement: IoC Container

```typescript
// 🔄 SUGGESTION - Full Injection Container
export class DIContainer {
    private services = new Map<string, any>();
    private factories = new Map<string, () => any>();
    
    register<T>(token: string, factory: () => T): void {
        this.factories.set(token, factory);
    }
    
    resolve<T>(token: string): T {
        if (this.services.has(token)) {
            return this.services.get(token);
        }
        
        const factory = this.factories.get(token);
        if (!factory) throw new Error(\`Service not found: \${token}\`);
        
        const service = factory();
        this.services.set(token, service);
        return service;
    }
}

// Configuration
const container = new DIContainer();

container.register('ILogLevelProvider', () => new LogLevelProvider());
container.register('ILoggerService', () => 
    new LoggerService(container.resolve('ILogLevelProvider'))
);
container.register('ILogger', () => 
    container.resolve<ILoggerService>('ILoggerService').createLogger('default')
);

// Usage - dependencies resolved automatically
const logger = container.resolve<ILogger>('ILogger');
logger.info('DIP with IoC Container!');
```

## 🏆 Summary - SOLID in ffs2-logger

### ✅ Excellent Points

1. **SRP**: Responsibilities clearly defined and separated
2. **OCP**: Easy extensions via interfaces and inheritance  
3. **LSP**: Perfect substitution of implementations
4. **ISP**: Atomic and composable interfaces
5. **DIP**: Dependency on abstractions, dependency injection

### 🔄 Possible Improvements

1. Formatter/renderer separation in ConsoleAppender
2. Dependency Injection Container
3. Externalized Configuration

**The project respects SOLID excellently! 🎯**