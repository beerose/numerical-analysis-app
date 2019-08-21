export function assertDefined<T>(x: T): Exclude<T, null | undefined> {
  console.assert(x, 'should be defined');
  return x as Exclude<T, null | undefined>;
}
