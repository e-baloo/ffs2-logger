# 🔧 Dependency Injection (DI) System

## 📋 Overview

The **Dependency Injection** (DI) system of `ffs2-logger` allows managing dependencies in a decoupled way, respecting the **Dependency Inversion** principle of SOLID.

### ✨ Benefits

- ✅ **SOLID** - Full respect of the Dependency Inversion Principle (DIP)
- ✅ **Testability** - Easy injection of mocks for tests
- ✅ **Flexibility** - Substitution of implementations without modifying the code
- ✅ **Performance** - Singleton management to optimize memory
- ✅ **Isolation** - Separate containers for different contexts
- ✅ **Type-safe** - Full type safety with TypeScript

---

## 🏗️ Architecture

### Main Components

```
src/
├── interfaces/di/
│   ├── InjectionToken.ts      # Service identification tokens
│   └── IDIContainer.ts         # DI Container Interface
├── services/
│   └── DIContainer.ts          # Container implementation
├── constants/
│   └── DITokens.ts             # Predefined tokens for ConsoleAppender
└── config/
    └── DIConfig.ts             # Global container configuration
```

---

## 📦 Basic Usage

### 1. Import Dependencies

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

### 2. Usage with Global Container (Default)

```typescript
import { LOGGER_SERVICE, ConsoleAppender } from '@ffs2/logger';

// ConsoleAppender automatically uses the global container
const appender = new ConsoleAppender(LOGGER_SERVICE);

// All dependencies are automatically resolved:
// - ConsoleFormatter (singleton)
// - ConsolePrinter (singleton)  
// - ConsoleColorized (singleton)
// - TemplateProvider (singleton)
```

### 3. Manual Injection

```typescript
import { 
    LOGGER_SERVICE,
    ConsoleAppender,
    ConsoleFormatter,
    ConsolePrinter
} from '@ffs2/logger';

// Create dependencies manually
const formatter = new ConsoleFormatter();
const printer = new ConsolePrinter();

// Inject into constructor
const appender = new ConsoleAppender(LOGGER_SERVICE, formatter, printer);
```

---

## 🎨 Customization

### Create a Custom Colorizer

```typescript
import type { IConsoleColorized, LogLevel } from '@ffs2/logger';

class RainbowColorizer implements IConsoleColorized {
    colorize(message: string, logLevel: LogLevel): string {
        // Your colorization logic
        return `\x1b[35m${message}\x1b[0m`; // Magenta
    }
}
```

### Register in a Custom Container

```typescript
import { 
    DIContainer,
    InjectionToken,
    ConsoleFormatter,
    TEMPLATE_PROVIDER_TOKEN
} from '@ffs2/logger';

// Create a new container
const customContainer = new DIContainer();

// Create a token for the colorizer
const RAINBOW_TOKEN = new InjectionToken<IConsoleColorized>('RainbowColorizer');

// Register the service
customContainer.register({
    token: RAINBOW_TOKEN,
    useFactory: () => new RainbowColorizer(),
    singleton: true  // One shared instance
});

// Register a formatter using the custom colorizer
customContainer.register({
    token: CONSOLE_FORMATTER_TOKEN,
    useFactory: () => new ConsoleFormatter(
        customContainer.resolve(RAINBOW_TOKEN),
        customContainer.resolve(TEMPLATE_PROVIDER_TOKEN)
    ),
    singleton: true
});

// Use the formatter
const customFormatter = customContainer.resolve(CONSOLE_FORMATTER_TOKEN);
const appender = new ConsoleAppender(LOGGER_SERVICE, customFormatter);
```

---

## 🧪 Unit Tests

### Mock Printer for Tests

```typescript
import type { IConsolePrinter } from '@ffs2/logger';

class MockPrinter implements IConsolePrinter {
    public calls: Array<{ message: string; data: string | null; error: string | null }> = [];
    
    print(message: string, data: string | null, error: string | null): void {
        // Capture calls instead of writing to console
        this.calls.push({ message, data, error });
    }
}

// In your tests
const mockPrinter = new MockPrinter();
const appender = new ConsoleAppender(LOGGER_SERVICE, undefined, mockPrinter);

// Use the appender
await appender.append({ level: 'info', message: 'Test', timestamp: Date.now() });

// Verify calls
expect(mockPrinter.calls).toHaveLength(1);
expect(mockPrinter.calls[0].message).toContain('Test');
```

### Isolated Test Container

```typescript
import { DIContainer } from '@ffs2/logger';

describe('ConsoleAppender', () => {
    let testContainer: DIContainer;
    let mockPrinter: MockPrinter;
    
    beforeEach(() => {
        testContainer = new DIContainer();
        mockPrinter = new MockPrinter();
        
        // Configure test container
        testContainer.register({
            token: CONSOLE_PRINTER_TOKEN,
            useFactory: () => mockPrinter,
            singleton: true
        });
        
        // ... other registrations
    });
    
    afterEach(() => {
        testContainer.clear(); // Clean up container
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

## 🔑 DIContainer API

### `register<T>(provider: Provider<T>): void`

Registers a provider in the container.

```typescript
container.register({
    token: MY_TOKEN,
    useFactory: () => new MyService(),
    singleton: true  // optional, default false
});
```

### `resolve<T>(token: Token<T>): T`

Resolves a dependency from the container.

```typescript
const service = container.resolve(MY_TOKEN);
```

### `has<T>(token: Token<T>): boolean`

Checks if a service is registered.

```typescript
if (container.has(MY_TOKEN)) {
    // Service is available
}
```

### `unregister<T>(token: Token<T>): void`

Removes a service from the container.

```typescript
container.unregister(MY_TOKEN);
```

### `clear(): void`

Completely resets the container (removes all services).

```typescript
container.clear();
```

---

## 🎯 Predefined Tokens

The package exports these tokens for ConsoleAppender:

```typescript
import {
    CONSOLE_COLORIZED_TOKEN,   // IConsoleColorized
    CONSOLE_FORMATTER_TOKEN,    // IConsoleFormatter
    CONSOLE_PRINTER_TOKEN,      // IConsolePrinter
    TEMPLATE_PROVIDER_TOKEN     // ITemplateProvider
} from '@ffs2/logger';
```

---

## ⚙️ Advanced Configuration

### Singleton vs Transient

```typescript
// Singleton - One shared instance
container.register({
    token: MY_TOKEN,
    useFactory: () => new MyService(),
    singleton: true
});

// Transient - New instance on each resolution
container.register({
    token: MY_TOKEN,
    useFactory: () => new MyService(),
    singleton: false  // or omitted
});
```

### Dependencies between Services

```typescript
// Service A depends on Service B
container.register({
    token: TOKEN_B,
    useFactory: () => new ServiceB(),
    singleton: true
});

container.register({
    token: TOKEN_A,
    useFactory: () => new ServiceA(
        container.resolve(TOKEN_B)  // Dependency resolution
    ),
    singleton: true
});
```

### Hierarchical Containers

```typescript
// Parent container (global configuration)
const parentContainer = new DIContainer();
parentContainer.register({
    token: SHARED_TOKEN,
    useFactory: () => new SharedService(),
    singleton: true
});

// Child container (local configuration)
const childContainer = new DIContainer();
childContainer.register({
    token: LOCAL_TOKEN,
    useFactory: () => new LocalService(
        parentContainer.resolve(SHARED_TOKEN)  // Uses parent
    ),
    singleton: true
});
```

---

## 📊 Impact on SOLID

### Before DI (Score: 8.0/10)

```typescript
class ConsoleAppender {
    constructor(
        service: ILoggerService,
        formatter: IConsoleFormatter = new ConsoleFormatter(),  // ❌ Concrete instantiation
        printer: IConsolePrinter = new ConsolePrinter()          // ❌ Concrete instantiation
    ) {}
}
```

**Issues:**
- ❌ Concrete dependencies in default values
- ❌ Strong coupling to implementations
- ❌ Difficult tests (hard-coded dependencies)

### After DI (Score: 9.5/10)

```typescript
class ConsoleAppender {
    constructor(
        service: ILoggerService,
        formatter?: IConsoleFormatter,
        printer?: IConsolePrinter
    ) {
        // ✅ Resolution via container
        this.formatter = formatter ?? globalContainer.resolve(CONSOLE_FORMATTER_TOKEN);
        this.printer = printer ?? globalContainer.resolve(CONSOLE_PRINTER_TOKEN);
    }
}
```

**Benefits:**
- ✅ Abstract dependencies only
- ✅ Loose coupling
- ✅ Easy tests (mock injection)
- ✅ Maximum extensibility

---

## 🔗 Useful Links

- [SOLID Documentation](./SOLID.md)
- [ConsoleAppender Guide](./ConsoleAppender.md)
- [Full Examples](../examples/di-usage-demo.ts)

---

## 💡 Best Practices

1. ✅ **Always define interfaces** for your services
2. ✅ **Use typed tokens** (`InjectionToken<T>`)
3. ✅ **Prefer singletons** for stateless services
4. ✅ **Isolate containers** in tests
5. ✅ **Document dependencies** in constructors
6. ✅ **Clean up containers** after tests (`clear()`)
7. ⚠️ **Avoid circular dependencies**
8. ⚠️ **Do not store state** in singleton services if shared

---

## 🎓 Complete Example

See [`examples/di-usage-demo.ts`](../examples/di-usage-demo.ts) for a complete demonstration including:

- Standard usage with global container
- Creating custom colorizers
- JSON formatters
- Multi-destination printers
- Isolated test containers
- Mocking for unit tests

---

**Updated:** 2025-11-18  
**Version:** 0.8.0-alpha2  
**Author:** ffs2-logger Team
