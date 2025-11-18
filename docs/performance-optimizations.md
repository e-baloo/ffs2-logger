# Guide d'Intégration des Optimisations de Performance

Ce guide explique comment utiliser les optimisations de performance implémentées dans ffs2-logger.

## 🚀 Optimisations Disponibles

### 1. Lazy Loading des Formatters
Les formatters sont chargés à la demande pour réduire le temps de démarrage et la consommation mémoire.

### 2. Pool d'Objets pour LogEvent
Réutilisation des objets LogEvent pour réduire les allocations et la pression sur le Garbage Collector.

### 3. Async Appenders avec Batching
Traitement par lots des événements de log pour améliorer les performances des appenders asynchrones.

## 📦 1. Lazy Loading des Formatters

### Utilisation de base
```typescript
import { lazyFormatterRegistry } from '@ffs2/logger';

// Voir les formatters disponibles
const available = lazyFormatterRegistry.getAvailableFormatters();
console.log('Formatters:', available); // ['printf']

// Obtenir un formatter (chargé à la demande)
const printf = lazyFormatterRegistry.getFormatter('printf');
if (printf) {
    const result = printf('Hello %s!', 'World');
    console.log(result); // "Hello World!"
}
```

### Enregistrer vos propres formatters
```typescript
// Enregistrer un formatter custom (factory pattern)
lazyFormatterRegistry.registerFormatter('custom', () => {
    return (template: string, ...args: any[]) => {
        // Votre logique de formatage custom
        return template.replace(/{(\d+)}/g, (match, number) => {
            return args[number] !== undefined ? args[number] : match;
        });
    };
});

// Utiliser le formatter custom
const customFormatter = lazyFormatterRegistry.getFormatter('custom');
const result = customFormatter?.('{0} is {1} years old', 'Alice', 30);
// "Alice is 30 years old"
```

### Enregistrer des transformers
```typescript
// Enregistrer des transformers pour le formatage
lazyFormatterRegistry.registerTransformers('markdown', () => ({
    bold: (text: string) => `**${text}**`,
    italic: (text: string) => `*${text}*`,
    code: (text: string) => \`\`\`${text}\`\`\`,
}));

const mdTransformers = lazyFormatterRegistry.getTransformers('markdown');
console.log(mdTransformers?.bold('Important')); // "**Important**"
```

## 🏊 2. Pool d'Objets LogEvent

### Utilisation de base
```typescript
import { logEventPool } from '@ffs2/logger';

// Acquérir un objet du pool
const event = logEventPool.acquire();

// Configurer l'événement
event.level = 'info';
event.message = 'Message important';
event.timestamp = Date.now();
event.context = 'mon-service';
event.data = { userId: 123, action: 'login' };

// Utiliser l'événement
console.log(event.message);

// IMPORTANT: Remettre l'objet dans le pool après usage
logEventPool.release(event);
```

### Pattern recommandé avec try/finally
```typescript
async function logWithPooling(level: string, message: string, data?: any) {
    const event = logEventPool.acquire();
    
    try {
        event.level = level;
        event.message = message;
        event.timestamp = Date.now();
        event.data = data;
        
        // Traiter l'événement
        await someAppender.append(event);
        
    } finally {
        // Toujours remettre dans le pool
        logEventPool.release(event);
    }
}
```

### Monitoring du pool
```typescript
// Obtenir les statistiques
const stats = logEventPool.getStats();
console.log('Pool stats:', {
    poolSize: stats.poolSize,        // Objets disponibles
    maxPoolSize: stats.maxPoolSize,  // Taille max du pool
    created: stats.created,          // Objets créés
    reused: stats.reused,           // Objets réutilisés
    hitRate: stats.hitRate          // Taux de réutilisation
});

// Préchauffer le pool (optionnel)
logEventPool.prewarm(20); // Créer 20 objets en avance
```

## 📝 3. Async Appenders avec Batching

### Configuration de base
```typescript
import { FileAsyncBatchAppender } from '@ffs2/logger';

const batchAppender = new FileAsyncBatchAppender({
    filePath: './logs/app.log',
    maxBatchSize: 100,          // Max 100 événements par lot
    maxWaitTime: 1000,          // Max 1s d'attente
    maxMemoryUsage: 1024 * 1024, // Max 1MB en mémoire
    enableRetry: true,          // Retry en cas d'erreur
    maxRetries: 3,              // Max 3 tentatives
    append: true                // Ajouter au fichier existant
});

// Initialiser l'appender
await batchAppender.initialize();
```

### Intégration avec le logger
```typescript
import { LOGGER_SERVICE } from '@ffs2/logger';

// Ajouter l'appender au service logger
LOGGER_SERVICE.addAppender(batchAppender);

// Les logs sont automatiquement mis en lot
LOGGER_SERVICE.info('Message 1');
LOGGER_SERVICE.info('Message 2');
LOGGER_SERVICE.info('Message 3');
// Ces 3 messages peuvent être traités en un seul lot
```

### Appender personnalisé avec batching
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
        // Implémenter votre logique de traitement
        const statements = events.map(event => ({
            level: event.level,
            message: event.message,
            timestamp: new Date(event.timestamp),
            context: event.context,
            data: JSON.stringify(event.data)
        }));

        // Insérer en base en une seule requête
        await this.insertBatch(statements);
    }

    private async insertBatch(statements: any[]): Promise<void> {
        // Votre logique d'insertion en base
        console.log(\`Inserting \${statements.length} log entries\`);
    }
}
```

### Monitoring des performances
```typescript
// Obtenir les stats de performance
const stats = batchAppender.getStats();
console.log('Batch performance:', {
    totalEvents: stats.totalEvents,     // Événements traités
    batchesFlushed: stats.batchesFlushed, // Lots traités
    avgBatchSize: stats.avgBatchSize,   // Taille moyenne des lots
    pendingEvents: stats.pendingEvents, // Événements en attente
    errors: stats.errors,               // Erreurs rencontrées
    retries: stats.retries,             // Tentatives de retry
    config: stats.config                // Configuration actuelle
});

// Forcer un flush (pour les tests ou arrêt)
await batchAppender.forceFlush();
```

## 🔄 Intégration Complete

Voici un exemple d'intégration complète des trois optimisations :

```typescript
import { 
    LOGGER_SERVICE, 
    logEventPool, 
    lazyFormatterRegistry,
    FileAsyncBatchAppender 
} from '@ffs2/logger';

// Configuration du système de log optimisé
export async function setupOptimizedLogging() {
    // 1. Configurer les formatters custom
    lazyFormatterRegistry.registerFormatter('json', () => {
        return (message: string, data?: any) => {
            return JSON.stringify({ message, data, timestamp: new Date() });
        };
    });

    // 2. Préchauffer le pool d'objets
    logEventPool.prewarm(50);

    // 3. Configurer l'appender avec batching
    const batchAppender = new FileAsyncBatchAppender({
        filePath: './logs/app-optimized.log',
        maxBatchSize: 50,
        maxWaitTime: 1000,
        enableRetry: true,
        formatter: (event) => {
            // Utiliser le formatter lazy-loaded
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

// Fonction de log optimisée
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

// Utilisation
async function main() {
    const { batchAppender } = await setupOptimizedLogging();
    
    // Logging optimisé
    await logOptimized('info', 'Application started', { version: '1.0.0' });
    await logOptimized('info', 'User logged in', { userId: 123 });
    
    // Nettoyage à l'arrêt
    process.on('SIGTERM', async () => {
        await batchAppender.destroy();
        console.log('Logging system shut down gracefully');
        process.exit(0);
    });
}
```

## 📊 Gains de Performance Attendus

- **Lazy Loading**: -20% à -40% du temps de démarrage selon le nombre de formatters
- **Object Pooling**: -30% à -60% d'allocations mémoire en régime établi  
- **Async Batching**: -50% à -80% d'opérations I/O selon la configuration

## ⚠️ Bonnes Pratiques

1. **Pool d'objets**: Toujours appeler `release()` après usage
2. **Batching**: Ajuster `maxBatchSize` et `maxWaitTime` selon vos besoins
3. **Monitoring**: Surveiller les stats pour optimiser les paramètres
4. **Cleanup**: Appeler `destroy()` sur les appenders avant l'arrêt
5. **Tests**: Utiliser `forceFlush()` pour les tests synchrones

## 🔧 Debugging

```typescript
// Logger les performances
setInterval(() => {
    console.log('Pool stats:', logEventPool.getStats());
    console.log('Registry stats:', lazyFormatterRegistry.getStats());
    console.log('Batch stats:', batchAppender.getStats());
}, 30000); // Toutes les 30 secondes
```