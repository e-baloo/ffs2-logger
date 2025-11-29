import type { Token } from './InjectionToken';

/**
 * Factory function pour créer une instance de service
 */
export type Factory<T> = () => T;

/**
 * Configuration d'un provider de service
 */
export interface Provider<T> {
    /**
     * Token d'identification du service
     */
    token: Token<T>;

    /**
     * Factory pour créer l'instance du service
     */
    useFactory: Factory<T>;

    /**
     * Si true, une seule instance sera créée et réutilisée (singleton)
     * Si false, une nouvelle instance sera créée à chaque résolution
     */
    singleton?: boolean;
}

/**
 * Interface du conteneur d'injection de dépendances
 */
export interface IDIContainer {
    /**
     * Enregistre un provider dans le conteneur
     * @param provider - Configuration du provider à enregistrer
     */
    register<T>(provider: Provider<T>): void;

    /**
     * Résout une dépendance depuis le conteneur
     * @param token - Token d'identification du service
     * @returns L'instance du service
     * @throws Error si le service n'est pas enregistré
     */
    resolve<T>(token: Token<T>): T;

    /**
     * Vérifie si un service est enregistré
     * @param token - Token d'identification du service
     * @returns true si le service est enregistré
     */
    has<T>(token: Token<T>): boolean;

    /**
     * Supprime un service du conteneur
     * @param token - Token d'identification du service
     */
    unregister<T>(token: Token<T>): void;

    /**
     * Réinitialise le conteneur (supprime tous les services)
     */
    clear(): void;
}
