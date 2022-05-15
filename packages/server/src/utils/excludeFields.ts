export function excludeFields<T, K extends Array<keyof T>>(
  fields: T,
  omit: K
): Record<keyof Omit<T, K[number]>, true> {
  return Object.keys(fields).reduce((acc, key) => {
    if (!omit.includes(key as keyof T)) {
      acc[key as keyof Omit<T, K[number]>] = true;
    }

    return acc;
  }, {} as Record<keyof Omit<T, K[number]>, true>);
}
