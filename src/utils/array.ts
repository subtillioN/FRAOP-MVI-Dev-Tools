/**
 * Groups an array of items by a key selector function.
 */
export function groupBy<T, K extends string | number>(
  items: T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  return items.reduce((groups, item) => {
    const key = keySelector(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

/**
 * Returns a new array with unique elements.
 * If a key selector is provided, uniqueness is determined by the key.
 */
export function unique<T, K = T>(
  items: T[],
  keySelector?: (item: T) => K
): T[] {
  if (!keySelector) {
    return Array.from(new Set(items));
  }

  const seen = new Set<K>();
  return items.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Flattens a nested array structure.
 */
export function flatten<T>(items: Array<T | Array<T>>): T[] {
  return items.reduce<T[]>((flat, item) => {
    if (Array.isArray(item)) {
      return flat.concat(item);
    }
    return flat.concat([item]);
  }, []);
}

/**
 * Splits an array into chunks of the specified size.
 */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Partitions an array into two arrays based on a predicate.
 * The first array contains elements that satisfy the predicate,
 * the second array contains elements that don't.
 */
export function partition<T>(
  items: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const matches: T[] = [];
  const nonMatches: T[] = [];

  items.forEach(item => {
    if (predicate(item)) {
      matches.push(item);
    } else {
      nonMatches.push(item);
    }
  });

  return [matches, nonMatches];
} 