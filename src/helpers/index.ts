/**
 * @license Apache-2.0
 *
 * Logger v2 helper utilities
 */

// Printf-style formatting (C-style: format('%.2f', 3.14))
export { format } from './format';

// Python-style formatting (stringFormat('{} {}', 'hello', 'world'))
// export { stringFormat, create as createStringFormat, extend as extendStringFormat, ValueError } from './stringFormat';

export { formatInterpolate } from './formatInterpolate';
// Types
export type { FormatToken } from './formatTokenize';
// Advanced APIs for granular control
export { formatTokenize } from './formatTokenize';
export type { FormatFunction, Transformer, Transformers } from './stringFormat/types';
