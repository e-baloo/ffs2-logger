/**
 * Unique injection token to identify dependencies
 * Used as a key to register and resolve services in the DI container
 * @template T - Type of the service associated with this token (used for type safety)
 */
export class InjectionToken<_T = unknown> {
    constructor(public readonly description: string) {}

    toString(): string {
        return `InjectionToken<${this.description}>`;
    }
}

/**
 * Type for injection tokens - can be a symbol, a string, or an InjectionToken
 */
export type Token<T = unknown> = InjectionToken<T> | symbol | string;
