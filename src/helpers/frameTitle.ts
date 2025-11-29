/**
 * Frame type for framing a title
 */
export type FrameType = 'simple' | 'double';

/**
 * Options for creating a framed title
 */
export interface FrameTitleOptions {
    /**
     * Frame type: 'simple' or 'double'
     * @default 'simple'
     */
    frameType?: FrameType;

    /**
     * Frame width in characters (between 50 and 200)
     * @default 80
     */
    width?: number;

    /**
     * Compact mode: if true, the title touches the borders directly
     * If false, there is an empty line between the frame and the title
     * @default false
     */
    compact?: boolean;

    /**
     * Displays the first empty line of the frame (default true)
     * @default true
     */
    firstEmptyLine?: boolean;
}

/**
 * Frame characters by type
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
 * Creates a framed title in an ASCII/Unicode frame
 *
 * @param title - The title to frame
 * @param options - Frame formatting options
 * @returns The framed title ready to be displayed
 *
 * @example
 * ```typescript
 * // Simple compact frame
 * console.log(frameTitle('My Title'));
 * // ┌──────────────────────────────────────────────────────────────────────────────┐
 * // │                                  My Title                                    │
 * // └──────────────────────────────────────────────────────────────────────────────┘
 *
 * // Double non-compact frame
 * console.log(frameTitle('My Title', { frameType: 'double', compact: false }));
 * // ╔══════════════════════════════════════════════════════════════════════════════╗
 * // ║                                                                              ║
 * // ║                                  My Title                                    ║
 * // ║                                                                              ║
 * // ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * // Custom frame
 * console.log(frameTitle('Short', { width: 50, frameType: 'double', compact: true }));
 * // ╔════════════════════════════════════════════════╗
 * // ║                     Short                      ║
 * // ╚════════════════════════════════════════════════╝
 * ```
 */
export const frameTitle = (title: string, options: FrameTitleOptions = {}): string => {
    const { frameType = 'simple', width = 80, compact = false, firstEmptyLine = true } = options;

    // Width validation
    const minWidth = 50;
    const maxWidth = 200;
    const finalWidth = Math.max(minWidth, Math.min(maxWidth, width));

    // Get frame characters
    const chars = FRAME_CHARS[frameType];

    // Inner width (without vertical borders)
    const innerWidth = finalWidth - 2;

    // Create horizontal line
    const horizontalLine = chars.horizontal.repeat(innerWidth);

    // Create top line
    const topLine = chars.topLeft + horizontalLine + chars.topRight;

    // Create bottom line
    const bottomLine = chars.bottomLeft + horizontalLine + chars.bottomRight;

    // Create empty line
    const emptyLine = chars.vertical + ' '.repeat(innerWidth) + chars.vertical;

    // Center title
    const titleLength = title.length;
    const paddingTotal = innerWidth - titleLength;
    const paddingLeft = Math.floor(paddingTotal / 2);
    const paddingRight = paddingTotal - paddingLeft;

    const titleLine = chars.vertical + ' '.repeat(paddingLeft) + title + ' '.repeat(paddingRight) + chars.vertical;

    // Build frame
    const lines: string[] = [];

    if (firstEmptyLine) {
        lines.push('\u200B'); // Zero-width space (invisible character)
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
