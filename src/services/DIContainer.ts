import type { IDIContainer, Provider } from '../interfaces/di/IDIContainer';
import type { Token } from '../interfaces/di/InjectionToken';

/**
 * Simple and efficient implementation of a Dependency Injection Container
 * Supports singletons and transient factories
 */
export class DIContainer implements IDIContainer {
    /**
     * Map storing registered providers
     */
    private readonly providers = new Map<Token<unknown>, Provider<unknown>>();

    /**
     * Cache for singleton instances
     */
    private readonly singletons = new Map<Token<unknown>, unknown>();

    /**
     * Registers a provider in the container
     */
    register<T>(provider: Provider<T>): void {
        this.providers.set(provider.token, provider);
    }

    /**
     * Resolves a dependency from the container
     * For singletons, always returns the same instance
     * For transients, creates a new instance on each call
     */
    resolve<T>(token: Token<T>): T {
        const provider = this.providers.get(token) as Provider<T> | undefined;

        if (!provider) {
            throw new Error(`No provider found for token: ${this.tokenToString(token)}`);
        }

        // If it's a singleton and already exists, return it
        if (provider.singleton) {
            const cached = this.singletons.get(token) as T | undefined;
            if (cached !== undefined) {
                return cached;
            }

            // Create and cache the singleton
            const instance = provider.useFactory();
            this.singletons.set(token, instance);
            return instance;
        }

        // For transients, create a new instance every time
        return provider.useFactory();
    }

    /**
     * Checks if a service is registered
     */
    has<T>(token: Token<T>): boolean {
        return this.providers.has(token);
    }

    /**
     * Removes a service from the container
     */
    unregister<T>(token: Token<T>): void {
        this.providers.delete(token);
        this.singletons.delete(token);
    }

    /**
     * Completely resets the container
     */
    clear(): void {
        this.providers.clear();
        this.singletons.clear();
    }

    /**
     * Converts a token to a readable string for error messages
     */
    private tokenToString(token: Token<unknown>): string {
        if (typeof token === 'string') {
            return `"${token}"`;
        }
        if (typeof token === 'symbol') {
            return token.toString();
        }
        return token.toString();
    }
}
