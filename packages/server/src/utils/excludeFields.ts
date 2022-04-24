export function excludeFields<T extends Record<string, unknown>, K extends Array<keyof T>>(
  fields: T,
  omit: K
) {
  return Object.keys(fields).reduce((acc, key) => {
    if (!omit.includes(key)) {
      acc[key as keyof Omit<T, K[number]>] = true;
    }

    return acc;
  }, {} as Record<keyof Omit<T, K[number]>, true>);
}
