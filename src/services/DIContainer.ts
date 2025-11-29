import type { IDIContainer, Provider } from '../interfaces/di/IDIContainer';
import type { Token } from '../interfaces/di/InjectionToken';

/**
 * Implémentation simple et efficace d'un conteneur d'injection de dépendances
 * Supporte les singletons et les factories transientes
 */
export class DIContainer implements IDIContainer {
    /**
     * Map stockant les providers enregistrés
     */
    private readonly providers = new Map<Token<unknown>, Provider<unknown>>();

    /**
     * Cache des instances singleton
     */
    private readonly singletons = new Map<Token<unknown>, unknown>();

    /**
     * Enregistre un provider dans le conteneur
     */
    register<T>(provider: Provider<T>): void {
        this.providers.set(provider.token, provider);
    }

    /**
     * Résout une dépendance depuis le conteneur
     * Pour les singletons, retourne toujours la même instance
     * Pour les transients, crée une nouvelle instance à chaque appel
     */
    resolve<T>(token: Token<T>): T {
        const provider = this.providers.get(token) as Provider<T> | undefined;

        if (!provider) {
            throw new Error(`No provider found for token: ${this.tokenToString(token)}`);
        }

        // Si c'est un singleton et qu'il existe déjà, le retourner
        if (provider.singleton) {
            const cached = this.singletons.get(token) as T | undefined;
            if (cached !== undefined) {
                return cached;
            }

            // Créer et mettre en cache le singleton
            const instance = provider.useFactory();
            this.singletons.set(token, instance);
            return instance;
        }

        // Pour les transients, créer une nouvelle instance à chaque fois
        return provider.useFactory();
    }

    /**
     * Vérifie si un service est enregistré
     */
    has<T>(token: Token<T>): boolean {
        return this.providers.has(token);
    }

    /**
     * Supprime un service du conteneur
     */
    unregister<T>(token: Token<T>): void {
        this.providers.delete(token);
        this.singletons.delete(token);
    }

    /**
     * Réinitialise complètement le conteneur
     */
    clear(): void {
        this.providers.clear();
        this.singletons.clear();
    }

    /**
     * Convertit un token en chaîne lisible pour les messages d'erreur
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
