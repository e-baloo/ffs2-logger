# 📊 ConsoleJsonAppender

## Overview

The `ConsoleJsonAppender` is a specialized appender that formats logs into **structured JSON** to facilitate parsing and integration with log analysis systems.

---

## 🎯 Use Cases

- **Production** - Structured logs for aggregation and analysis
- **CI/CD** - Automatic parsing of build/test logs
- **Monitoring** - Integration with ELK, Splunk, Datadog, etc.
- **Debugging** - Readable format with all metadata
- **APIs** - Standardized logs for microservices

---

## 📦 Installation

```typescript
import { ConsoleJsonAppender } from '@ffs2/logger';
import { LOGGER_SERVICE } from '@ffs2/logger';
```

---

## 🚀 Basic Usage

### Simple Example

```typescript
import { LOGGER_SERVICE, ConsoleJsonAppender } from '@ffs2/logger';

// Create a JSON appender
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);

// Add to service
LOGGER_SERVICE.addAppender(jsonAppender);

// Use as usual
const logger = LOGGER_SERVICE.createLogger('MyApp');
logger.info('Application started');
```

**Output:**
```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",
  "level": "INFO",
  "message": "Application started",
  "context": "MyApp"
}
```

---

## ⚙️ Configuration

### Compact Mode (One Line)

```typescript
// Pretty print (default)
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);

// Compact (one line)
const compactAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,  // formatter (optional)
    undefined,  // printer (optional)
    undefined,  // container (optional)
    true        // compact = true
);
```

**Compact output:**
```json
{"timestamp":"2025-11-19T12:00:00.000Z","level":"INFO","message":"Message","context":"MyApp"}
```

### With Colorization

```typescript
import { ConsoleColorized } from '@ffs2/logger';

const colorizer = new ConsoleColorized();
const formatter = new ConsoleJsonFormatter(colorizer);
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE, formatter);
```

### With Custom DI Container

```typescript
import { DIContainer, InjectionToken } from '@ffs2/logger';

const customContainer = new DIContainer();
// ... container configuration

const jsonAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    undefined,
    customContainer
);
```

---

## 📋 JSON Format

### Basic Structure

```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",  // ISO 8601
  "level": "INFO",                          // UPPERCASE
  "message": "Log message",
  "context": "MyContext"                    // Optional
}
```

### With Data

```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",
  "level": "INFO",
  "message": "User data",
  "context": "UserService",
  "data": {
    "userId": 12345,
    "action": "login",
    "ip": "192.168.1.1"
  }
}
```

### With Error

```json
{
  "timestamp": "2025-11-19T12:00:00.000Z",
  "level": "ERROR",
  "message": "Connection error",
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

### Constructor

```typescript
constructor(
    service: ILoggerService,
    formatter?: IConsoleFormatter,
    printer?: IConsolePrinter,
    container?: IDIContainer,
    compact?: boolean
)
```

**Parameters:**
- `service` - Logger service (required)
- `formatter` - Custom formatter (optional, default: `ConsoleJsonFormatter`)
- `printer` - Custom printer (optional, default: `ConsolePrinter`)
- `container` - DI Container (optional, default: `globalContainer`)
- `compact` - Compact mode (optional, default: `false`)

### Methods (inherited from ILoggerAppender)

```typescript
// Log level management
getLogLevel(): LogLevel
setLogLevel(level: LogLevel): void

// Adding logs
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

The default JSON formatter used.

### Standalone Usage

```typescript
import { ConsoleJsonFormatter } from '@ffs2/logger';

const formatter = new ConsoleJsonFormatter(
    colorizer?,  // IConsoleColorized (optional)
    compact?     // boolean (optional, default: false)
);

const [message, data, error] = formatter.formatEvent(logEvent);
```

### Features

- ✅ Automatic ISO 8601 Timestamp
- ✅ UPPERCASE Level
- ✅ Support for complex data (objects, arrays)
- ✅ Full error capture (message, stack, name)
- ✅ Compact mode or pretty print
- ✅ Optional colorization

---

## 💡 Advanced Examples

### Multi-Appenders (Console + JSON)

```typescript
import { ConsoleAppender, ConsoleJsonAppender } from '@ffs2/logger';

// Standard console for development
const consoleAppender = new ConsoleAppender(LOGGER_SERVICE);

// JSON for production
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE, undefined, undefined, undefined, true);

// Use both
LOGGER_SERVICE.addAppender(consoleAppender);
LOGGER_SERVICE.addAppender(jsonAppender);

const logger = LOGGER_SERVICE.createLogger('App');
logger.info('Message visible in both formats');
```

### Filtering by Level

```typescript
const jsonAppender = new ConsoleJsonAppender(LOGGER_SERVICE);

// Only errors and warnings in JSON
jsonAppender.setLogLevel('warn');

LOGGER_SERVICE.addAppender(jsonAppender);

const logger = LOGGER_SERVICE.createLogger('App');
logger.debug('Not in JSON');    // Filtered
logger.info('Not in JSON');     // Filtered
logger.warn('In JSON');         // ✅ Displayed
logger.error('In JSON');        // ✅ Displayed
```

### Integration with ELK Stack

```typescript
// Configuration for Logstash
const jsonAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    undefined,
    undefined,
    true  // Compact for Logstash
);

jsonAppender.setLogLevel('info');
LOGGER_SERVICE.addAppender(jsonAppender);

// Logs are now parsable by Logstash
const logger = LOGGER_SERVICE.createLogger('API');
logger.info('Request received', {
    method: 'POST',
    path: '/api/users',
    duration: 125
});
```

---

## 🧪 Tests

### Mock Printer for Tests

```typescript
import { ConsoleJsonAppender } from '@ffs2/logger';

class MockPrinter implements IConsolePrinter {
    public logs: string[] = [];
    
    print(message: string): void {
        this.logs.push(message);
    }
}

// In your tests
const mockPrinter = new MockPrinter();
const jsonAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    mockPrinter
);

// Use and verify
const logger = LOGGER_SERVICE.createLogger('Test');
logger.info('Test message');

expect(mockPrinter.logs).toHaveLength(1);
const logData = JSON.parse(mockPrinter.logs[0]);
expect(logData.message).toBe('Test message');
expect(logData.level).toBe('INFO');
```

---

## 📊 Comparison with ConsoleAppender

| Aspect                  | ConsoleAppender | ConsoleJsonAppender |
| ----------------------- | --------------- | ------------------- |
| **Format**              | Formatted text  | Structured JSON     |
| **Human Readability**   | ✅ Excellent    | ⚠️ Average          |
| **Automatic Parsing**   | ❌ Difficult    | ✅ Easy             |
| **Log Integration**     | ⚠️ Limited      | ✅ Excellent        |
| **Colorization**        | ✅ Yes          | ✅ Yes (optional)   |
| **Performance**         | ✅ Fast         | ✅ Fast             |
| **Size**                | ✅ Compact      | ⚠️ More verbose     |

---

## 🎯 Best Practices

### Development

```typescript
// Use ConsoleAppender for readability
const devAppender = new ConsoleAppender(LOGGER_SERVICE);
LOGGER_SERVICE.addAppender(devAppender);
```

### Production

```typescript
// Use compact ConsoleJsonAppender for aggregation
const prodAppender = new ConsoleJsonAppender(
    LOGGER_SERVICE,
    undefined,
    undefined,
    undefined,
    true  // Compact
);
prodAppender.setLogLevel('info');  // No debug in prod
LOGGER_SERVICE.addAppender(prodAppender);
```

### Conditional Environment

```typescript
const appender = process.env.NODE_ENV === 'production'
    ? new ConsoleJsonAppender(LOGGER_SERVICE, undefined, undefined, undefined, true)
    : new ConsoleAppender(LOGGER_SERVICE);

LOGGER_SERVICE.addAppender(appender);
```

---

## 🔗 Useful Links

- [DI Documentation](./DependencyInjection.md)
- [ConsoleAppender Guide](./ConsoleAppender.md)
- [Examples](../examples/console-json-appender-demo.ts)

---

## ⚠️ Important Notes

1. **Template Ignored** - `ConsoleJsonFormatter` ignores templates because JSON format is fixed
2. **Performance** - JSON.stringify can be expensive for very large objects
3. **Size** - JSON logs are larger than text logs
4. **Colorization** - Colorization adds ANSI characters (disable for files)

---

**Version:** 0.8.0-alpha2  
**Updated:** 2025-11-19  
**Author:** ffs2-logger Team
