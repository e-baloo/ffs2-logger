import { isNil } from './isNil';

export const isObject = (fn: any): fn is object => !isNil(fn) && typeof fn === 'object';
