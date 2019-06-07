import { useCallback, useState } from 'react';

export function useBoolean(initialState: boolean) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(s => !s), []);
  const turnOn = useCallback(() => setState(true), []);
  const turnOff = useCallback(() => setState(false), []);
  return [state, { toggle, turnOn, turnOff }] as const;
}
