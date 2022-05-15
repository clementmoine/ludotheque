import { omit } from 'utils/omit';

export function excludeFields<T, K extends Array<keyof T>>(
  fields: T,
  exclude: K
): Record<keyof Omit<T, K[number]>, true> {
  return Object.keys(omit(fields, exclude)).reduce((acc, key) => {
    acc[key as keyof Omit<T, K[number]>] = true;

    return acc;
  }, {} as Record<keyof Omit<T, K[number]>, true>);
}
