/**
 * Type de cadre pour encadrer un titre
 */
export type FrameType = 'simple' | 'double';

/**
 * Options pour créer un titre encadré
 */
export interface FrameTitleOptions {
    /**
     * Type de cadre : 'simple' ou 'double'
     * @default 'simple'
     */
    frameType?: FrameType;

    /**
     * Largeur du cadre en caractères (entre 50 et 200)
     * @default 80
     */
    width?: number;

    /**
     * Mode compact : si true, le titre touche directement les bordures
     * Si false, il y a une ligne vide entre le cadre et le titre
     * @default false
     */
    compact?: boolean;

    /**
     * Affiche la première ligne vide du cadre (par défaut true)
     * @default true
     */
    firstEmptyLine?: boolean;
}

/**
 * Caractères de cadre selon le type
 */
const FRAME_CHARS = {
    simple: {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│',
    },
    double: {
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        horizontal: '═',
        vertical: '║',
    },
} as const;

/**
 * Crée un titre encadré dans un cadre ASCII/Unicode
 *
 * @param title - Le titre à encadrer
 * @param options - Options de formatage du cadre
 * @returns Le titre encadré prêt à être affiché
 *
 * @example
 * ```typescript
 * // Cadre simple compact
 * console.log(frameTitle('Mon Titre'));
 * // ┌──────────────────────────────────────────────────────────────────────────────┐
 * // │                                  Mon Titre                                   │
 * // └──────────────────────────────────────────────────────────────────────────────┘
 *
 * // Cadre double non-compact
 * console.log(frameTitle('Mon Titre', { frameType: 'double', compact: false }));
 * // ╔══════════════════════════════════════════════════════════════════════════════╗
 * // ║                                                                              ║
 * // ║                                  Mon Titre                                   ║
 * // ║                                                                              ║
 * // ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * // Cadre personnalisé
 * console.log(frameTitle('Court', { width: 50, frameType: 'double', compact: true }));
 * // ╔════════════════════════════════════════════════╗
 * // ║                     Court                      ║
 * // ╚════════════════════════════════════════════════╝
 * ```
 */
export const frameTitle = (title: string, options: FrameTitleOptions = {}): string => {
    const { frameType = 'simple', width = 80, compact = false, firstEmptyLine = true } = options;

    // Validation de la largeur
    const minWidth = 50;
    const maxWidth = 200;
    const finalWidth = Math.max(minWidth, Math.min(maxWidth, width));

    // Récupération des caractères de cadre
    const chars = FRAME_CHARS[frameType];

    // Largeur intérieure (sans les bordures verticales)
    const innerWidth = finalWidth - 2;

    // Création de la ligne horizontale
    const horizontalLine = chars.horizontal.repeat(innerWidth);

    // Création de la ligne supérieure
    const topLine = chars.topLeft + horizontalLine + chars.topRight;

    // Création de la ligne inférieure
    const bottomLine = chars.bottomLeft + horizontalLine + chars.bottomRight;

    // Création d'une ligne vide
    const emptyLine = chars.vertical + ' '.repeat(innerWidth) + chars.vertical;

    // Centrage du titre
    const titleLength = title.length;
    const paddingTotal = innerWidth - titleLength;
    const paddingLeft = Math.floor(paddingTotal / 2);
    const paddingRight = paddingTotal - paddingLeft;

    const titleLine = chars.vertical + ' '.repeat(paddingLeft) + title + ' '.repeat(paddingRight) + chars.vertical;

    // Construction du cadre
    const lines: string[] = [];

    if (firstEmptyLine) {
        lines.push('\u200B'); // Zero-width space (caractère invisible)
    }

    lines.push(topLine);

    if (!compact) {
        lines.push(emptyLine);
    }

    lines.push(titleLine);

    if (!compact) {
        lines.push(emptyLine);
    }

    lines.push(bottomLine);

    return lines.join('\n');
};
