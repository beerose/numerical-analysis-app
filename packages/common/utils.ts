export type Typeguard<T> = (x: unknown) => x is T;

export const partial = <T>() => <K extends keyof T>(source: Pick<T, K>) =>
  source;
