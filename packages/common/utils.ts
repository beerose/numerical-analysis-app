import { GroupType } from '.';

export type Typeguard<T> = (x: unknown) => x is T;

export function isGroupKind(x: unknown): x is GroupType {
  return Object.values(GroupType).includes(x);
}
