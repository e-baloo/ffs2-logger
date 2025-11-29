# 🔧 Système de Dependency Injection (DI)

## 📋 Vue d'ensemble

Le système de **Dependency Injection** (DI) de `ffs2-logger` permet de gérer les dépendances de manière découplée, respectant le principe **Dependency Inversion** de SOLID.

### ✨ Avantages

- ✅ **SOLID** - Respect total du principe Dependency Inversion (DIP)
- ✅ **Testabilité** - Injection facile de mocks pour les tests
- ✅ **Flexibilité** - Substitution des implémentations sans modifier le code
- ✅ **Performance** - Gestion des singletons pour optimiser la mémoire
- ✅ **Isolation** - Containers séparés pour différents contextes
- ✅ **Type-safe** - Sécurité de type complète avec TypeScript

---

## 🏗️ Architecture

### Composants principaux

```
src/
├── interfaces/di/
│   ├── InjectionToken.ts      # Tokens d'identification des services
│   └── IDIContainer.ts         # Interface du conteneur DI
├── services/
│   └── DIContainer.ts          # Implémentation du conteneur
├── constants/
│   └── DITokens.ts             # Tokens prédéfinis pour ConsoleAppender
└── config/
    └── DIConfig.ts             # Configuration globale du container
```

---

## 📦 Utilisation de base

### 1. Import des dépendances

```typescript
import {
    globalContainer,
    DIContainer,
    InjectionToken,
    ConsoleAppender,
    CONSOLE_FORMATTER_TOKEN,
    CONSOLE_PRINTER_TOKEN
} from '@ffs2/logger';
```

### 2. Utilisation avec le container global (par défaut)

```typescript
import { LOGGER_SERVICE, ConsoleAppender } from '@ffs2/logger';

// Le ConsoleAppender utilise automatiquement le container global
const appender = new ConsoleAppender(LOGGER_SERVICE);

// Toutes les dépendances sont résolues automatiquement:
// - ConsoleFormatter (singleton)
// - ConsolePrinter (singleton)  
// - ConsoleColorized (singleton)
// - TemplateProvider (singleton)
```

### 3. Injection manuelle

```typescript
import { 
    LOGGER_SERVICE,
    ConsoleAppender,
    ConsoleFormatter,
    ConsolePrinter
} from '@ffs2/logger';

// Créer les dépendances manuellement
const formatter = new ConsoleFormatter();
const printer = new ConsolePrinter();

// Injecter dans le constructeur
const appender = new ConsoleAppender(LOGGER_SERVICE, formatter, printer);
```

---

## 🎨 Personnalisation

### Créer un colorizer personnalisé

```typescript
import type { IConsoleColorized, LogLevel } from '@ffs2/logger';

class RainbowColorizer implements IConsoleColorized {
    colorize(message: string, logLevel: LogLevel): string {
        // Votre logique de colorisation
        return `\x1b[35m${message}\x1b[0m`; // Magenta
    }
}
```

### Enregistrer dans un container personnalisé

```typescript
import { 
    DIContainer,
    InjectionToken,
    ConsoleFormatter,
    TEMPLATE_PROVIDER_TOKEN
} from '@ffs2/logger';

// Créer un nouveau container
const customContainer = new DIContainer();

// Créer un token pour le colorizer
const RAINBOW_TOKEN = new InjectionToken<IConsoleColorized>('RainbowColorizer');

// Enregistrer le service
customContainer.register({
    token: RAINBOW_TOKEN,
    useFactory: () => new RainbowColorizer(),
    singleton: true  // Une seule instance partagée
});

// Enregistrer un formatter utilisant le colorizer personnalisé
customContainer.register({
    token: CONSOLE_FORMATTER_TOKEN,
    useFactory: () => new ConsoleFormatter(
        customContainer.resolve(RAINBOW_TOKEN),
        customContainer.resolve(TEMPLATE_PROVIDER_TOKEN)
    ),
    singleton: true
});

// Utiliser le formatter
const customFormatter = customContainer.resolve(CONSOLE_FORMATTER_TOKEN);
const appender = new ConsoleAppender(LOGGER_SERVICE, customFormatter);
```

---

## 🧪 Tests unitaires

### Mock Printer pour les tests

```typescript
import type { IConsolePrinter } from '@ffs2/logger';

class MockPrinter implements IConsolePrinter {
    public calls: Array<{ message: string; data: string | null; error: string | null }> = [];
    
    print(message: string, data: string | null, error: string | null): void {
        // Capturer les appels au lieu d'écrire sur la console
        this.calls.push({ message, data, error });
    }
}

// Dans vos tests
const mockPrinter = new MockPrinter();
const appender = new ConsoleAppender(LOGGER_SERVICE, undefined, mockPrinter);

// Utiliser l'appender
await appender.append({ level: 'info', message: 'Test', timestamp: Date.now() });

// Vérifier les appels
expect(mockPrinter.calls).toHaveLength(1);
expect(mockPrinter.calls[0].message).toContain('Test');
```

### Container de test isolé

```typescript
import { DIContainer } from '@ffs2/logger';

describe('ConsoleAppender', () => {
    let testContainer: DIContainer;
    let mockPrinter: MockPrinter;
    
    beforeEach(() => {
        testContainer = new DIContainer();
        mockPrinter = new MockPrinter();
        
        // Configurer le container de test
        testContainer.register({
            token: CONSOLE_PRINTER_TOKEN,
            useFactory: () => mockPrinter,
            singleton: true
        });
        
        // ... autres registrations
    });
    
    afterEach(() => {
        testContainer.clear(); // Nettoyer le container
    });
    
    it('should log message', () => {
        const formatter = testContainer.resolve(CONSOLE_FORMATTER_TOKEN);
        const printer = testContainer.resolve(CONSOLE_PRINTER_TOKEN);
        const appender = new ConsoleAppender(LOGGER_SERVICE, formatter, printer);
        
        // Test...
    });
});
```

---

## 🔑 API du DIContainer

### `register<T>(provider: Provider<T>): void`

Enregistre un provider dans le conteneur.

```typescript
container.register({
    token: MY_TOKEN,
    useFactory: () => new MyService(),
    singleton: true  // optionnel, false par défaut
});
```

### `resolve<T>(token: Token<T>): T`

Résout une dépendance depuis le conteneur.

```typescript
const service = container.resolve(MY_TOKEN);
```

### `has<T>(token: Token<T>): boolean`

Vérifie si un service est enregistré.

```typescript
if (container.has(MY_TOKEN)) {
    // Le service est disponible
}
```

### `unregister<T>(token: Token<T>): void`

Supprime un service du conteneur.

```typescript
container.unregister(MY_TOKEN);
```

### `clear(): void`

Réinitialise complètement le conteneur (supprime tous les services).

```typescript
container.clear();
```

---

## 🎯 Tokens prédéfinis

Le package exporte ces tokens pour ConsoleAppender :

```typescript
import {
    CONSOLE_COLORIZED_TOKEN,   // IConsoleColorized
    CONSOLE_FORMATTER_TOKEN,    // IConsoleFormatter
    CONSOLE_PRINTER_TOKEN,      // IConsolePrinter
    TEMPLATE_PROVIDER_TOKEN     // ITemplateProvider
} from '@ffs2/logger';
```

---

## ⚙️ Configuration avancée

### Singleton vs Transient

```typescript
// Singleton - Une seule instance partagée
container.register({
    token: MY_TOKEN,
    useFactory: () => new MyService(),
    singleton: true
});

// Transient - Nouvelle instance à chaque résolution
container.register({
    token: MY_TOKEN,
    useFactory: () => new MyService(),
    singleton: false  // ou omis
});
```

### Dépendances entre services

```typescript
// Service A dépend de Service B
container.register({
    token: TOKEN_B,
    useFactory: () => new ServiceB(),
    singleton: true
});

container.register({
    token: TOKEN_A,
    useFactory: () => new ServiceA(
        container.resolve(TOKEN_B)  // Résolution de la dépendance
    ),
    singleton: true
});
```

### Containers hiérarchiques

```typescript
// Container parent (configuration globale)
const parentContainer = new DIContainer();
parentContainer.register({
    token: SHARED_TOKEN,
    useFactory: () => new SharedService(),
    singleton: true
});

// Container enfant (configuration locale)
const childContainer = new DIContainer();
childContainer.register({
    token: LOCAL_TOKEN,
    useFactory: () => new LocalService(
        parentContainer.resolve(SHARED_TOKEN)  // Utilise le parent
    ),
    singleton: true
});
```

---

## 📊 Impact sur SOLID

### Avant DI (Score: 8.0/10)

```typescript
class ConsoleAppender {
    constructor(
        service: ILoggerService,
        formatter: IConsoleFormatter = new ConsoleFormatter(),  // ❌ Instanciation concrète
        printer: IConsolePrinter = new ConsolePrinter()          // ❌ Instanciation concrète
    ) {}
}
```

**Problèmes:**
- ❌ Dépendances concrètes dans les valeurs par défaut
- ❌ Couplage fort aux implémentations
- ❌ Tests difficiles (hard-coded dependencies)

### Après DI (Score: 9.5/10)

```typescript
class ConsoleAppender {
    constructor(
        service: ILoggerService,
        formatter?: IConsoleFormatter,
        printer?: IConsolePrinter
    ) {
        // ✅ Résolution via le container
        this.formatter = formatter ?? globalContainer.resolve(CONSOLE_FORMATTER_TOKEN);
        this.printer = printer ?? globalContainer.resolve(CONSOLE_PRINTER_TOKEN);
    }
}
```

**Avantages:**
- ✅ Dépendances abstraites uniquement
- ✅ Couplage faible
- ✅ Tests faciles (injection de mocks)
- ✅ Extensibilité maximale

---

## 🔗 Liens utiles

- [Documentation SOLID](./SOLID.md)
- [Guide ConsoleAppender](./ConsoleAppender.md)
- [Exemples complets](../examples/di-usage-demo.ts)

---

## 💡 Bonnes pratiques

1. ✅ **Toujours définir des interfaces** pour vos services
2. ✅ **Utiliser des tokens typés** (`InjectionToken<T>`)
3. ✅ **Préférer les singletons** pour les services sans état
4. ✅ **Isoler les containers** dans les tests
5. ✅ **Documenter les dépendances** dans les constructeurs
6. ✅ **Nettoyer les containers** après les tests (`clear()`)
7. ⚠️ **Éviter les dépendances circulaires**
8. ⚠️ **Ne pas stocker d'état** dans les services singleton si partagés

---

## 🎓 Exemple complet

Voir [`examples/di-usage-demo.ts`](../examples/di-usage-demo.ts) pour une démonstration complète incluant:

- Utilisation standard avec le container global
- Création de colorizers personnalisés
- Formatters JSON
- Printers multi-destination
- Containers de test isolés
- Mocking pour les tests unitaires

---

**Mise à jour:** 2025-11-18  
**Version:** 0.8.0-alpha2  
**Auteur:** ffs2-logger Team
