import { AssertionError } from 'assert';

export function assertDefined<T>(x: T): Exclude<T, null | undefined> {
  console.assert(x, 'should be defined');
  return x!;
}
