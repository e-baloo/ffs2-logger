import type { Token } from './InjectionToken';

/**
 * Factory function to create a service instance
 */
export type Factory<T> = () => T;

/**
 * Service provider configuration
 */
export interface Provider<T> {
    /**
     * Service identification token
     */
    token: Token<T>;

    /**
     * Factory to create the service instance
     */
    useFactory: Factory<T>;

    /**
     * If true, a single instance will be created and reused (singleton)
     * If false, a new instance will be created on each resolution
     */
    singleton?: boolean;
}

/**
 * Dependency Injection Container Interface
 */
export interface IDIContainer {
    /**
     * Registers a provider in the container
     * @param provider - Provider configuration to register
     */
    register<T>(provider: Provider<T>): void;

    /**
     * Resolves a dependency from the container
     * @param token - Service identification token
     * @returns The service instance
     * @throws Error if the service is not registered
     */
    resolve<T>(token: Token<T>): T;

    /**
     * Checks if a service is registered
     * @param token - Service identification token
     * @returns true if the service is registered
     */
    has<T>(token: Token<T>): boolean;

    /**
     * Removes a service from the container
     * @param token - Service identification token
     */
    unregister<T>(token: Token<T>): void;

    /**
     * Resets the container (removes all services)
     */
    clear(): void;
}
