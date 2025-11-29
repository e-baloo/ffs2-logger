/**
 * Token d'injection unique pour identifier les dépendances
 * Utilisé comme clé pour enregistrer et résoudre les services dans le conteneur DI
 * @template T - Type du service associé à ce token (utilisé pour la sécurité de type)
 */
export class InjectionToken<_T = unknown> {
    constructor(public readonly description: string) {}

    toString(): string {
        return `InjectionToken<${this.description}>`;
    }
}

/**
 * Type pour les tokens d'injection - peut être un symbole, une chaîne ou un InjectionToken
 */
export type Token<T = unknown> = InjectionToken<T> | symbol | string;
