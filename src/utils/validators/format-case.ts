function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

export function mapKeysToCamelCase(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => mapKeysToCamelCase(item));
  } else if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce(
      (acc, key) => {
        const camelKey = toCamelCase(key);
        acc[camelKey] = mapKeysToCamelCase(data[key]);
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return data;
}
