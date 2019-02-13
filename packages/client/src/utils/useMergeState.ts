import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type MakeState<S> = (prevState: S) => S;

export function useMergeState<S extends object>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<Partial<S>>>] {
  const [state, setState] = useState<S>(initialState);
  const mergeState = useCallback((s: SetStateAction<Partial<S>>) => {
    setState((prev: S) => {
      const newState =
        typeof s === 'function' ? (s as MakeState<Partial<S>>)(prev) : s;
      return { ...prev, ...newState };
    });
  }, []);
  return [state, mergeState];
}

export function useMergeKey<T extends object, K extends keyof T>(
  mergeState: Dispatch<SetStateAction<Partial<T>>>,
  key: K
) {
  return useCallback(
    (value: T[K]) => mergeState(({ [key]: value } as Pick<T, K>) as Partial<T>),
    []
  );
}
