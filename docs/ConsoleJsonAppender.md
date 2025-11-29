# 📊 ConsoleJsonAppender

## Vue d'ensemble

Le `ConsoleJsonAppender` est un appender spécialisé qui formate les logs en **JSON structuré** pour faciliter le parsing et l'intégration avec les systèmes d'analyse de logs.

---

## 🎯 Cas d'Usage

- **Production** - Logs structurés pour agrégation et analyse
- **CI/CD** - Parsing automatique des logs de build/test
- **Monitoring** - Intégration avec ELK, Splunk, Datadog, etc.
- **Debugging** - Format lisible avec toutes les métadonnées
- **APIs** - Logs standardisés pour microservices

---

## 📦 Installation

```typescript
import { ConsoleJsonAppender } from '@ffs2/logger';
import { LOGGER_SERVICE } from '@ffs2/logger';
```

---

## 🚀 Utilisation de Base

### Exemple Simple

```typescript
import { LOGGER_SERVICE, ConsoleJsonAppender } from '@ffs2/logger';

// Créer un appender JSON
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);

// Ajouter au service
LOGGER_SERVICE.addAppender(jsonAppender);

// Utiliser comme d'habitude
const logger = LOGGER_SERVICE.createLogger('MyApp');
logger.info('Application démarrée');
```

**Sortie:**
```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",
  "level": "INFO",
  "message": "Application démarrée",
  "context": "MyApp"
}
```

---

## ⚙️ Configuration

### Mode Compact (Une Ligne)

```typescript
// Pretty print (par défaut)
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);

// Compact (une ligne)
const compactAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,  // formatter (optionnel)
    undefined,  // printer (optionnel)
    undefined,  // container (optionnel)
    true        // compact = true
);
```

**Sortie compact:**
```json
{"timestamp":"2025-11-19T12:00:00.000Z","level":"INFO","message":"Message","context":"MyApp"}
```

### Avec Colorisation

```typescript
import { ConsoleColorized } from '@ffs2/logger';

const colorizer = new ConsoleColorized();
const formatter = new ConsoleJsonFormatter(colorizer);
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE, formatter);
```

### Avec DI Container Personnalisé

```typescript
import { DIContainer, InjectionToken } from '@ffs2/logger';

const customContainer = new DIContainer();
// ... configuration du container

const jsonAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    undefined,
    customContainer
);
```

---

## 📋 Format JSON

### Structure de Base

```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",  // ISO 8601
  "level": "INFO",                          // UPPERCASE
  "message": "Message de log",
  "context": "MyContext"                    // Optionnel
}
```

### Avec Données

```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",
  "level": "INFO",
  "message": "Données utilisateur",
  "context": "UserService",
  "data": {
    "userId": 12345,
    "action": "login",
    "ip": "192.168.1.1"
  }
}
```

### Avec Erreur

```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",
  "level": "ERROR",
  "message": "Erreur de connexion",
  "context": "Database",
  "error": {
    "message": "Connection timeout",
    "stack": "Error: Connection timeout\\n    at ...",
    "name": "TimeoutError"
  }
}
```

---

## 🔧 API

### Constructeur

```typescript
constructor(
    service: ILoggerService,
    formatter?: IConsoleFormatter,
    printer?: IConsolePrinter,
    container?: IDIContainer,
    compact?: boolean
)
```

**Paramètres:**
- `service` - Service logger (requis)
- `formatter` - Formatter personnalisé (optionnel, défaut: `ConsoleJsonFormatter`)
- `printer` - Printer personnalisé (optionnel, défaut: `ConsolePrinter`)
- `container` - Container DI (optionnel, défaut: `globalContainer`)
- `compact` - Mode compact (optionnel, défaut: `false`)

### Méthodes (héritées de ILoggerAppender)

```typescript
// Gestion du niveau de log
getLogLevel(): LogLevel
setLogLevel(level: LogLevel): void

// Ajout de logs
append(events: LogEvent | LogEvent[]): Promise<void>

// Lifecycle
initialize(): void
destroy(): void
isInitialized(): boolean

// Identification
getSymbolIdentifier(): symbol
```

---

## 🎨 ConsoleJsonFormatter

Le formatter JSON utilisé par défaut.

### Utilisation Standalone

```typescript
import { ConsoleJsonFormatter } from '@ffs2/logger';

const formatter = new ConsoleJsonFormatter(
    colorizer?,  // IConsoleColorized (optionnel)
    compact?     // boolean (optionnel, défaut: false)
);

const [message, data, error] = formatter.formatEvent(logEvent);
```

### Caractéristiques

- ✅ Timestamp ISO 8601 automatique
- ✅ Level en MAJUSCULES
- ✅ Support des données complexes (objets, tableaux)
- ✅ Capture complète des erreurs (message, stack, name)
- ✅ Mode compact ou pretty print
- ✅ Colorisation optionnelle

---

## 💡 Exemples Avancés

### Multi-Appenders (Console + JSON)

```typescript
import { ConsoleAppender, ConsoleJsonAppender } from '@ffs2/logger';

// Console standard pour développement
const consoleAppender = new ConsoleAppender(LOGGER_SERVICE);

// JSON pour production
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE, undefined, undefined, undefined, true);

// Utiliser les deux
LOGGER_SERVICE.addAppender(consoleAppender);
LOGGER_SERVICE.addAppender(jsonAppender);

const logger = LOGGER_SERVICE.createLogger('App');
logger.info('Message visible dans les 2 formats');
```

### Filtering par Niveau

```typescript
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);

// Seulement les erreurs et warnings en JSON
jsonAppender.setLogLevel('warn');

LOGGER_SERVICE.addAppender(jsonAppender);

const logger = LOGGER_SERVICE.createLogger('App');
logger.debug('Pas dans JSON');    // Filtré
logger.info('Pas dans JSON');     // Filtré
logger.warn('Dans JSON');         // ✅ Affiché
logger.error('Dans JSON');        // ✅ Affiché
```

### Intégration avec ELK Stack

```typescript
// Configuration pour Logstash
const jsonAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    undefined,
    undefined,
    true  // Compact pour Logstash
);

jsonAppender.setLogLevel('info');
LOGGER_SERVICE.addAppender(jsonAppender);

// Les logs sont maintenant parsables par Logstash
const logger = LOGGER_SERVICE.createLogger('API');
logger.info('Request received', {
    method: 'POST',
    path: '/api/users',
    duration: 125
});
```

---

## 🧪 Tests

### Mock Printer pour Tests

```typescript
import { ConsoleJsonAppender } from '@ffs2/logger';

class MockPrinter implements IConsolePrinter {
    public logs: string[] = [];
    
    print(message: string): void {
        this.logs.push(message);
    }
}

// Dans vos tests
const mockPrinter = new MockPrinter();
const jsonAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    mockPrinter
);

// Utiliser et vérifier
const logger = LOGGER_SERVICE.createLogger('Test');
logger.info('Test message');

expect(mockPrinter.logs).toHaveLength(1);
const logData = JSON.parse(mockPrinter.logs[0]);
expect(logData.message).toBe('Test message');
expect(logData.level).toBe('INFO');
```

---

## 📊 Comparaison avec ConsoleAppender

| Aspect                  | ConsoleAppender | ConsoleJsonAppender |
| ----------------------- | --------------- | ------------------- |
| **Format**              | Texte formaté   | JSON structuré      |
| **Lisibilité humaine**  | ✅ Excellente    | ⚠️ Moyenne           |
| **Parsing automatique** | ❌ Difficile     | ✅ Facile            |
| **Intégration logs**    | ⚠️ Limitée       | ✅ Excellente        |
| **Colorisation**        | ✅ Oui           | ✅ Oui (optionnel)   |
| **Performance**         | ✅ Rapide        | ✅ Rapide            |
| **Taille**              | ✅ Compact       | ⚠️ Plus verbeux      |

---

## 🎯 Best Practices

### Développement

```typescript
// Utiliser ConsoleAppender pour la lisibilité
const devAppender = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(devAppender);
```

### Production

```typescript
// Utiliser ConsoleJsonAppender compact pour l'agrégation
const prodAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    undefined,
    undefined,
    true  // Compact
);
prodAppender.setLogLevel('info');  // Pas de debug en prod
LOGGER_SERVICE.addAppender(prodAppender);
```

### Environnement Conditionnel

```typescript
const appender = process.env.NODE_ENV === 'production'
    ? new ConsoleJsonAppender(LOGGER_SERVICE, undefined, undefined, undefined, true)
    : new ConsoleAppender(LOGGER_SERVICE);

LOGGER_SERVICE.addAppender(appender);
```

---

## 🔗 Liens Utiles

- [Documentation DI](./DependencyInjection.md)
- [Guide ConsoleAppender](./ConsoleAppender.md)
- [Exemples](../examples/console-json-appender-demo.ts)

---

## ⚠️ Notes Importantes

1. **Template Ignoré** - Le `ConsoleJsonFormatter` ignore les templates car le format JSON est fixe
2. **Performance** - JSON.stringify peut être coûteux pour des objets très larges
3. **Taille** - Les logs JSON sont plus volumineux que les logs texte
4. **Colorisation** - La colorisation ajoute des caractères ANSI (à désactiver pour les fichiers)

---

**Version:** 0.8.0-alpha2  
**Mise à jour:** 2025-11-19  
**Auteur:** ffs2-logger Team
