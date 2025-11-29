/**
 * Lazy loading registry for formatters
 * Only loads formatters when they are actually used
 */

import type { FormatFunction, Transformers } from './stringFormat/types';

type FormatterFactory = () => FormatFunction;
type TransformersFactory = () => Transformers;

export class LazyFormatterRegistry {
    private formatters = new Map<string, FormatFunction>();
    private transformers = new Map<string, Transformers>();
    private formatterFactories = new Map<string, FormatterFactory>();
    private transformerFactories = new Map<string, TransformersFactory>();

    constructor() {
        this.registerBuiltinFormatters();
    }

    /**
     * Register a formatter factory (not the formatter itself)
     */
    registerFormatter(name: string, factory: FormatterFactory): void {
        this.formatterFactories.set(name, factory);
    }

    /**
     * Register transformers factory (not the transformers themselves)
     */
    registerTransformers(name: string, factory: TransformersFactory): void {
        this.transformerFactories.set(name, factory);
    }

    /**
     * Get formatter - creates it if needed (lazy loading)
     */
    getFormatter(name: string): FormatFunction | null {
        // Return cached formatter if exists
        if (this.formatters.has(name)) {
            const formatter = this.formatters.get(name);
            return formatter ?? null;
        }

        // Create formatter from factory if exists
        const factory = this.formatterFactories.get(name);
        if (factory) {
            const formatter = factory();
            this.formatters.set(name, formatter);
            return formatter;
        }

        return null;
    }

    /**
     * Get transformers - creates them if needed (lazy loading)
     */
    getTransformers(name: string): Transformers | null {
        // Return cached transformers if exists
        if (this.transformers.has(name)) {
            const transformers = this.transformers.get(name);
            return transformers ?? null;
        }

        // Create transformers from factory if exists
        const factory = this.transformerFactories.get(name);
        if (factory) {
            const transformers = factory();
            this.transformers.set(name, transformers);
            return transformers;
        }

        return null;
    }

    /**
     * Register built-in formatters
     */
    registerBuiltinFormatters(): void {
        // Printf-style formatter
        this.registerFormatter('printf', () => {
            const { format } = require('./format');
            return format;
        });

        // String format with common transformers
        this.registerTransformers('common', () => ({
            upper: (s: string) => s.toUpperCase(),
            lower: (s: string) => s.toLowerCase(),
            escape: (s: string) => s.replace(/[&<>"'`]/g, c => `&#${c.charCodeAt(0)};`),
            trim: (s: string) => s.trim(),
            date: (d: Date) => d.toISOString(),
            json: (obj: unknown) => JSON.stringify(obj),
        }));

        // HTML-safe transformers
        this.registerTransformers('html', () => ({
            escape: (s: string) => s.replace(/[&<>"'`]/g, c => `&#${c.charCodeAt(0)};`),
            attr: (s: string) => s.replace(/["']/g, '&quot;'),
            stripTags: (s: string) => s.replace(/<[^>]*>/g, ''),
        }));

        // Log-specific transformers
        this.registerTransformers('log', () => ({
            timestamp: (d: Date = new Date()) => d.toISOString(),
            level: (level: string) => `[${level.toUpperCase().padEnd(5)}]`,
            truncate: (s: string, maxLength = 100) => (s.length > maxLength ? `${s.substring(0, maxLength)}...` : s),
        }));
    }

    /**
     * Get list of available formatter names
     */
    getAvailableFormatters(): string[] {
        return Array.from(this.formatterFactories.keys());
    }

    /**
     * Get list of available transformer names
     */
    getAvailableTransformers(): string[] {
        return Array.from(this.transformerFactories.keys());
    }

    /**
     * Get stats for monitoring
     */
    getStats(): {
        cachedFormatters: number;
        cachedTransformers: number;
        registeredFormatters: number;
        registeredTransformers: number;
    } {
        return {
            cachedFormatters: this.formatters.size,
            cachedTransformers: this.transformers.size,
            registeredFormatters: this.formatterFactories.size,
            registeredTransformers: this.transformerFactories.size,
        };
    }
}

// Export singleton instance
export const lazyFormatterRegistry = new LazyFormatterRegistry();
