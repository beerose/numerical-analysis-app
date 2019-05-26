/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
type Primitive = boolean | number | string | bigint | symbol | null | undefined;

type Narrowable = Primitive | object | {};

type Entry<K extends PropertyKey, V> = readonly [K, V];

// prettier-ignore
/**
 * @author https://stackoverflow.com/users/2887218/jcalz
 * @see https://stackoverflow.com/a/50375286/10325032
 */
type UnionToIntersection<Union> =
  (Union extends any
      ? (argument: Union) => void
      : never
  ) extends (argument: infer Intersection) => void
      ? Intersection
      : never;

type FromEntries<
  T extends Entry<K, V>,
  K extends PropertyKey,
  V extends Narrowable
> = UnionToIntersection<
  T extends readonly [infer Key, infer Value]
    ? Key extends PropertyKey
      ? Record<Key, Value>
      : never
    : never
>;

export function fromEntries<
  T extends Entry<K, V>,
  K extends PropertyKey,
  V extends Narrowable
>(entries: Iterable<T>): FromEntries<T, K, V> {
  return [...entries].reduce(
    (accumulator, [key, value]) => ({
      ...accumulator,
      [key.toString()]: value,
    }),
    {} as FromEntries<T, K, V>
  );
}
