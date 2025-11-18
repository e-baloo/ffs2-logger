# Exemples Pratiques SOLID dans ffs2-logger

Ce document présente des exemples concrets d'application des principes SOLID dans le projet ffs2-logger.

## 🎯 Single Responsibility Principle (SRP)

### ✅ Exemple Positif : Séparation claire des responsabilités

```typescript
// ✅ BONNE PRATIQUE - Chaque classe a UNE responsabilité

// Responsabilité : Gestion des niveaux de log UNIQUEMENT
export class LogLevelProvider implements ILogLevelProvider {
    private level: LogLevel;
    
    getLogLevel(): LogLevel { /* ... */ }
    logLevelPriority(level: LogLevel): number { /* ... */ }
    isLogLevelEnabled(current: LogLevel, target: LogLevel): boolean { /* ... */ }
}

// Responsabilité : Pool d'objets UNIQUEMENT  
export class LogEventPool {
    private pool: PoolableLogEvent[] = [];
    
    acquire(): PoolableLogEvent { /* ... */ }
    release(event: PoolableLogEvent): void { /* ... */ }
    getStats(): PoolStats { /* ... */ }
}

// Responsabilité : Registry avec lazy loading UNIQUEMENT
export class LazyFormatterRegistry {
    private formatters = new Map<string, FormatFunction>();
    
    registerFormatter(name: string, factory: FormatterFactory): void { /* ... */ }
    getFormatter(name: string): FormatFunction | null { /* ... */ }
}
```

### ⚠️ Point d'amélioration : ConsoleAppender

```typescript
// ⚠️ AMÉLIORATION POSSIBLE - ConsoleAppender fait 2 choses
export class ConsoleAppender implements ILoggerAppender {
    // Responsabilité 1: Formatage des événements
    protected formatEvent(event: LogEvent): string { /* ... */ }
    protected formatLogLevel(event: LogEvent): string { /* ... */ }
    protected formatDate(event: LogEvent): string { /* ... */ }
    
    // Responsabilité 2: Affichage/Rendu
    protected printMessages(event: LogEvent): void { /* ... */ }
    private printData(event: LogEvent): void { /* ... */ }
    private printError(event: LogEvent): void { /* ... */ }
}

// 🔄 SUGGESTION D'AMÉLIORATION
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

### ✅ Exemple Excellent : AsyncBatchAppender

```typescript
// ✅ EXCELLENTE PRATIQUE - Fermé à modification, ouvert à extension
export abstract class AsyncBatchAppender implements ILoggerAppender {
    // Code stable, fermé à modification
    protected batch: LogEvent[] = [];
    protected stats: BatchStats;
    
    async append(message: LogEvent | LogEvent[]): Promise<void> {
        // Logique de batching stable
        const events = Array.isArray(message) ? message : [message];
        for (const event of events) {
            await this.addToBatch(event);
        }
    }
    
    protected async flush(): Promise<void> {
        // Logique de flush stable
        if (this.batch.length === 0) return;
        
        const batchToFlush = [...this.batch];
        this.batch = [];
        
        try {
            await this.processBatch(batchToFlush); // Point d'extension
        } catch (error) {
            // Gestion d'erreur stable
        }
    }
    
    // Point d'extension - ouvert à nouveaux comportements
    protected abstract processBatch(events: LogEvent[]): Promise<void>;
}

// Extension 1: Fichier
export class FileAsyncBatchAppender extends AsyncBatchAppender {
    protected async processBatch(events: LogEvent[]): Promise<void> {
        const content = events.map(e => this.formatEvent(e)).join('\n');
        await appendFile(this.filePath, content);
    }
}

// Extension 2: Base de données (sans modifier AsyncBatchAppender)
export class DatabaseBatchAppender extends AsyncBatchAppender {
    protected async processBatch(events: LogEvent[]): Promise<void> {
        await this.database.insertBatch(events);
    }
}

// Extension 3: API REST (sans modifier AsyncBatchAppender)
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
// ✅ Extension de formatters sans modification du code existant
const registry = lazyFormatterRegistry;

// Extension 1: Formatter JSON
registry.registerFormatter('json', () => {
    return (template: string, data: any) => JSON.stringify({ template, data });
});

// Extension 2: Formatter XML  
registry.registerFormatter('xml', () => {
    return (template: string, data: any) => 
        \`<log><template>\${template}</template><data>\${JSON.stringify(data)}</data></log>\`;
});

// Extension 3: Transformer custom
registry.registerTransformers('security', () => ({
    mask: (value: string) => '*'.repeat(value.length),
    hash: (value: string) => require('crypto').createHash('sha256').update(value).digest('hex'),
    redact: (obj: any) => ({ ...obj, password: '[REDACTED]', token: '[REDACTED]' })
}));

// Utilisation - code client inchangé
const formatter = registry.getFormatter('json');
const xmlFormatter = registry.getFormatter('xml');
```

## 🔄 Liskov Substitution Principle (LSP)

### ✅ Substitution parfaite des Appenders

```typescript
// ✅ EXCELLENTE PRATIQUE - Tous les appenders sont substituables
export function setupLogging(appenders: ILoggerAppender[]) {
    const service = new LoggerService();
    
    // Tous respectent parfaitement le contrat ILoggerAppender
    for (const appender of appenders) {
        await appender.initialize(); // Contrat respecté
        service.addAppender(appender); // Substitution parfaite
    }
    
    return service;
}

// Utilisation - parfaitement interchangeables
const configs = [
    // Configuration 1: Console seulement
    [new ConsoleAppender(service)],
    
    // Configuration 2: Console + Fichier avec batching
    [
        new ConsoleAppender(service),
        new FileAsyncBatchAppender({ filePath: './app.log', maxBatchSize: 100 })
    ],
    
    // Configuration 3: Tous les appenders
    [
        new ConsoleAppender(service),
        new FileAsyncBatchAppender({ filePath: './app.log', maxBatchSize: 100 }),
        new DatabaseBatchAppender({ connectionString: 'db://...' })
    ]
];

// Tous fonctionnent identiquement - LSP respecté
for (const config of configs) {
    const service = await setupLogging(config);
    service.createLogger('test').info('Test message');
}
```

### ✅ Substitution des Providers

```typescript
// ✅ Providers interchangeables
export class CustomLogLevelProvider implements ILogLevelProvider {
    getLogLevel(): LogLevel { return 'debug'; }
    logLevelPriority(level: LogLevel): number { /* custom logic */ }
    isLogLevelEnabled(current: LogLevel, target: LogLevel): boolean { /* custom logic */ }
}

// Substitution transparente
const standardService = new LoggerService(new LogLevelProvider());
const customService = new LoggerService(new CustomLogLevelProvider());

// Même interface, comportement garanti
const logger1 = standardService.createLogger('test1');
const logger2 = customService.createLogger('test2'); 
// Les deux respectent parfaitement le contrat
```

## 🧩 Interface Segregation Principle (ISP)

### ✅ Interfaces atomiques et composables

```typescript
// ✅ EXCELLENTE PRATIQUE - Interfaces fines et spécialisées

// Interface atomique 1: Identification
export interface ISymbolIdentifier {
    getSymbolIdentifier(): symbol;
}

// Interface atomique 2: Niveau de log (lecture seule)
export interface IGetterLogLevel {
    getLogLevel(): LogLevel;
}

// Interface atomique 3: Niveau de log (écriture seule)
export interface ISetterLogLevel {
    setLogLevel(level: LogLevel): void;
}

// Interface atomique 4: Cycle de vie
export interface ILifecycle {
    initialize(): void;
    destroy(): void;
    isInitialized(): boolean;
}

// Interface atomique 5: Vérification de niveau
export interface IisLogLevelEnabled {
    isLogLevelEnabled(currentLevel: LogLevel, targetLevel: LogLevel): boolean;
}

// Composition selon les besoins exacts
export interface ILogLevel extends IGetterLogLevel, ISetterLogLevel {} // Juste get/set

export interface ILoggerAppender extends 
    ILifecycle,        // A besoin du cycle de vie
    ISymbolIdentifier, // A besoin d'identification
    ILogLevel {        // A besoin de gestion des niveaux
    append(message: LogEvent | LogEvent[]): Promise<void>;
}

export interface ILogLevelProvider extends IisLogLevelEnabled {
    getLogLevel(): LogLevel;
    logLevelPriority(level: LogLevel): number;
}
```

### ✅ Clients n'implémentent que ce dont ils ont besoin

```typescript
// Client 1: Juste besoin de lire le niveau
class LogLevelChecker {
    constructor(private provider: IGetterLogLevel) {} // Interface minimale
    
    check(): boolean {
        return this.provider.getLogLevel() === 'debug';
    }
}

// Client 2: Juste besoin de l'identification
class AppenderRegistry {
    private appenders = new Map<symbol, ILoggerAppender>();
    
    register(appender: ISymbolIdentifier) { // Interface minimale
        this.appenders.set(appender.getSymbolIdentifier(), appender as any);
    }
}

// Client 3: Besoin du cycle de vie seulement
class LifecycleManager {
    async initializeAll(components: ILifecycle[]) { // Interface minimale
        for (const component of components) {
            if (!component.isInitialized()) {
                await component.initialize();
            }
        }
    }
}
```

## ⬆️ Dependency Inversion Principle (DIP)

### ✅ Dépendance vers les abstractions

```typescript
// ✅ EXCELLENTE PRATIQUE - Dépendance vers les interfaces

// Classe de haut niveau dépend de l'abstraction
export class LoggerService implements ILoggerService {
    constructor(
        private levelProvider: ILogLevelProvider = new LogLevelProvider() // Abstraction
    ) {
        this.level = this.levelProvider.getLogLevel();
    }
    
    createLogger(context: string): ILogger {
        // Dépend de l'interface ILogger, pas de Logger concret
        const logger = new Logger(context, this, this.appenders);
        return logger; // Retourne l'interface
    }
}

// Logger dépend des abstractions
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

// Appenders dépendent des abstractions
export class ConsoleAppender implements ILoggerAppender {
    constructor(private service: ILoggerService) {} // Abstraction, pas LoggerService
}

export abstract class AsyncBatchAppender implements ILoggerAppender {
    // Utilise l'abstraction PoolableLogEvent
    protected returnEventsToPool(events: LogEvent[]): void {
        for (const event of events) {
            if ('_inPool' in event && typeof event._inPool === 'boolean') {
                logEventPool.release(event as PoolableLogEvent); // Interface
            }
        }
    }
}
```

### ✅ Injection de dépendance et configuration

```typescript
// ✅ Configuration externalisée respectant DIP
export interface ILoggerConfiguration {
    defaultLogLevel: LogLevel;
    appenders: ILoggerAppender[];
    levelProvider: ILogLevelProvider;
}

export class ConfigurableLoggerService extends LoggerService {
    constructor(config: ILoggerConfiguration) {
        super(config.levelProvider); // Injection de l'abstraction
        
        this.setLogLevel(config.defaultLogLevel);
        
        for (const appender of config.appenders) {
            this.addAppender(appender); // Interface, pas implémentation
        }
    }
}

// Utilisation - assemblage des dépendances à l'extérieur
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

### 🔄 Amélioration suggérée : Container IoC

```typescript
// 🔄 SUGGESTION - Container d'injection complète
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

// Utilisation - dépendances résolues automatiquement
const logger = container.resolve<ILogger>('ILogger');
logger.info('DIP with IoC Container!');
```

## 🏆 Résumé - SOLID dans ffs2-logger

### ✅ Points Excellents

1. **SRP** : Responsabilités clairement définies et séparées
2. **OCP** : Extensions faciles via interfaces et héritage  
3. **LSP** : Substitution parfaite des implementations
4. **ISP** : Interfaces atomiques et composables
5. **DIP** : Dépendance vers abstractions, injection de dépendances

### 🔄 Améliorations Possibles

1. Séparation formatter/renderer dans ConsoleAppender
2. Container d'injection de dépendance
3. Configuration externalisée

**Le projet respecte excellemment SOLID ! 🎯**