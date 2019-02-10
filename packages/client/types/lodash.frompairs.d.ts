declare function fromPairs<K extends string | number, V>(
  pairs: [K, V][]
): Record<K, V>;

export = fromPairs;
