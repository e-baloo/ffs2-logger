/**
 * @license Apache-2.0
 *
 * Type definitions for string-format
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: use any for flexibility */

/**
 * Transformer function type
 * Transforms a value to a string representation
 */
export type Transformer = (value: any) => string;

/**
 * Transformers map type
 * Maps transformer names to their functions
 */
export type Transformers = Record<string, Transformer>;

/**
 * Format function type
 * Formats a template string with values
 */

export type FormatFunction = (template: string, ...args: any[]) => string;
