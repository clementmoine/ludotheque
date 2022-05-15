export function omit<T, K extends Array<keyof T>>(object: T, keys: K): Omit<T, K[number]> {
  return Object.keys(object).reduce((acc, key) => {
    if (!keys.includes(key as keyof T)) {
      acc[key as keyof T] = object[key as keyof T];
    }

    return acc;
  }, {} as T);
}
