import { isUndefined } from './isUndefined';

export const isNil = (val: any): val is null | undefined => isUndefined(val) || val === null;
