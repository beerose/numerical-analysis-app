import { fromEntries } from './fromEntries';

export function makeIdDict<T extends { id: PropertyKey }>(xs: T[]) {
  return fromEntries(xs.map(x => [x.id, x] as [T['id'], T]));
}
