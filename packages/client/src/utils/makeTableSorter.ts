type TableSorter<T> = (a: T, b: T) => number;

export function makeTableSorter<K extends string>(
  prop: K
): TableSorter<Record<K, any>>;
export function makeTableSorter<T>(get: (_: T) => any): TableSorter<T>;
export function makeTableSorter<T>(
  accessor: keyof T | ((_: T) => any)
): TableSorter<T> {
  const get = typeof accessor === 'function' ? accessor : (x: T) => x[accessor];
  return (a: T, b: T) => {
    const ax = get(a);
    if (typeof ax === 'number') {
      return ax - get(b);
    }
    return ax < get(b) ? 1 : -1;
  };
}
