/**
 * Démonstration pratique du respect des principes SOLID
 * dans ffs2-logger avec exemples concrets d'extensibilité
 */

import {
    LOGGER_SERVICE,
    logEventPool,
    lazyFormatterRegistry,
    AAsyncBatchAppender,
    type ILoggerAppender,
    type LogLevel
} from '../src/index';
import type { LogEvent } from '../src/types/LogEvent';

// ==========================================
// CLASSES POUR LA DÉMONSTRATION
// ==========================================

// Extension 2: Nouvel appender via héritage
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

// Création d'une classe qui dépend des abstractions
class SOLIDLogger {
    constructor(
        private service: typeof LOGGER_SERVICE,  // Interface ILoggerService
        private pool: typeof logEventPool,       // Interface de pool
        private registry: typeof lazyFormatterRegistry // Interface de registry
    ) { }

    async logWithOptimizations(level: LogLevel, message: string, data?: unknown) {
        // Utilise le pool d'objets
        const event = this.pool.acquire();

        try {
            event.level = level;
            event.message = message;
            event.timestamp = Date.now();
            event.data = data;
            event.context = 'SOLID-demo';

            // Utilise le formatter lazy-loadé
            const formatter = this.registry.getFormatter('json-pretty');
            if (formatter) {
                event.message = formatter(message, data);
            }

            // Utilise le service logger
            const logger = this.service.createLogger('SOLIDDemo');
            await logger.sendEvent(event);

        } finally {
            // Retourne au pool
            this.pool.release(event);
        }
    }
}

// ==========================================
// DÉMONSTRATION SOLID PRINCIPLES
// ==========================================

async function demonstrateSOLID() {
    console.log('🏗️ Démonstration Architecture SOLID - ffs2-logger\n');

    // ==========================================
    // 1. SINGLE RESPONSIBILITY PRINCIPLE
    // ==========================================
    console.log('📋 1. Single Responsibility Principle');

    // ✅ Chaque classe a UNE responsabilité claire
    console.log('✅ Pool d\'objets - UNIQUEMENT pooling:');
    console.log('   Pool stats:', logEventPool.getStats());

    console.log('✅ Registry lazy - UNIQUEMENT lazy loading:');
    console.log('   Formatters disponibles:', lazyFormatterRegistry.getAvailableFormatters());
    console.log('   Registry stats:', lazyFormatterRegistry.getStats());

    console.log('✅ LoggerService - UNIQUEMENT gestion des loggers:');
    console.log('   Nombre d\'appenders:', LOGGER_SERVICE.listAppenders().length);
    console.log('');

    // ==========================================
    // 2. OPEN/CLOSED PRINCIPLE
    // ==========================================
    console.log('🔓 2. Open/Closed Principle - Extension sans modification');

    // Extension 1: Nouveau formatter sans modifier le code existant
    console.log('✅ Extension 1: Nouveau formatter JSON');
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

    // Extension 2: Nouvel appender via héritage
    console.log('✅ Extension 2: Nouvel appender Memory sans modification');

    const memoryAppender = new MemoryAppender();
    await memoryAppender.initialize();
    console.log('   Memory appender créé et initialisé');
    console.log('');

    // ==========================================
    // 3. LISKOV SUBSTITUTION PRINCIPLE
    // ==========================================
    console.log('🔄 3. Liskov Substitution Principle - Substituabilité parfaite');

    // Toutes les implémentations d'appenders sont parfaitement substituables
    const testAppenders: ILoggerAppender[] = [
        memoryAppender,
        // Tous respectent le même contrat ILoggerAppender
    ];

    console.log('✅ Test de substitution:');
    for (const appender of testAppenders) {
        // Même interface pour tous
        console.log(`   - ${appender.constructor.name}: Level=${appender.getLogLevel()}, Initialized=${appender.isInitialized()}`);

        // Comportement identique garanti
        const testEvent: LogEvent = {
            level: 'info',
            message: 'Test substitution',
            timestamp: Date.now(),
            context: 'SOLID-test'
        };

        await appender.append(testEvent);
    }

    // Vérification que MemoryAppender a bien reçu le log
    console.log('   Memory logs reçus:', memoryAppender.getLogs());
    console.log('');

    // ==========================================
    // 4. INTERFACE SEGREGATION PRINCIPLE
    // ==========================================
    console.log('🧩 4. Interface Segregation Principle - Interfaces spécialisées');

    // Les clients n'utilisent que les interfaces dont ils ont besoin
    function logLevelChecker(provider: { getLogLevel(): LogLevel }) {
        // Interface minimale - juste getLogLevel
        return provider.getLogLevel();
    }

    function lifecycleManager(component: { initialize(): void; isInitialized(): boolean }) {
        // Interface minimale - juste lifecycle
        if (!component.isInitialized()) {
            component.initialize();
        }
        return 'Lifecycle managed';
    }

    function identifierChecker(component: { getSymbolIdentifier(): symbol }) {
        // Interface minimale - juste identifier
        return component.getSymbolIdentifier().toString();
    }

    console.log('✅ Utilisation d\'interfaces spécialisées:');
    console.log(`   - LogLevel checker: ${logLevelChecker(LOGGER_SERVICE)}`);
    console.log(`   - Lifecycle manager: ${lifecycleManager(memoryAppender)}`);
    console.log(`   - Identifier: ${identifierChecker(memoryAppender).substring(0, 30)}...`);
    console.log('');

    // ==========================================
    // 5. DEPENDENCY INVERSION PRINCIPLE  
    // ==========================================
    console.log('⬆️ 5. Dependency Inversion Principle - Dépendance vers abstractions');

    // ✅ Injection des dépendances (abstractions)
    const solidLogger = new SOLIDLogger(
        LOGGER_SERVICE,           // Abstraction ILoggerService
        logEventPool,            // Abstraction Pool
        lazyFormatterRegistry    // Abstraction Registry
    );

    console.log('✅ Logger SOLID créé avec injection de dépendances');

    // Ajout de l'appender memory pour voir le résultat
    LOGGER_SERVICE.addAppender(memoryAppender);

    // Test du logging avec toutes les optimisations
    await solidLogger.logWithOptimizations('info', 'Message SOLID', {
        principle: 'Dependency Inversion',
        working: true
    });

    console.log('✅ Log avec optimisations envoyé');
    await memoryAppender.forceFlush();

    console.log('   Memory logs finaux:', memoryAppender.getLogs());
    console.log('');

    // ==========================================
    // RÉSUMÉ DE L'ARCHITECTURE SOLID
    // ==========================================
    console.log('🎯 RÉSUMÉ - Architecture SOLID');
    console.log('✅ S - Single Responsibility: Chaque classe a une responsabilité claire');
    console.log('✅ O - Open/Closed: Extension facile via interfaces et héritage');
    console.log('✅ L - Liskov Substitution: Implémentations parfaitement substituables');
    console.log('✅ I - Interface Segregation: Interfaces atomiques et spécialisées');
    console.log('✅ D - Dependency Inversion: Dépendance vers abstractions');

    console.log('\n📊 Stats finales:');
    console.log('   Pool stats:', logEventPool.getStats());
    console.log('   Registry stats:', lazyFormatterRegistry.getStats());
    console.log('   Memory appender stats:', memoryAppender.getStats());

    // Nettoyage
    await memoryAppender.destroy();
    console.log('\n✅ Démonstration SOLID terminée avec succès! 🚀');
}

// Exécuter la démonstration
demonstrateSOLID().catch(console.error);

export { SOLIDLogger, MemoryAppender };