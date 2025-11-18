export const LOG_LEVEL = [
    'silly',
    'debug',
    'trace',
    'verbose',
    'log',
    'info',
    'http',
    'data',
    'warn',
    'httpError',
    'error',
    'fatal',
] as const;

export type LogLevel = (typeof LOG_LEVEL)[number];

export const LOG_PRIORITY: LogLevel[][] = [
    ['fatal'],
    ['error', 'httpError'],
    ['warn'],
    ['log', 'info', 'http', 'data'],
    ['verbose'],
    ['trace', 'debug'],
    ['silly'],
] as const;
