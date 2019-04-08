import { useCallback, useState } from 'react';

export function useToggle(initialState: boolean) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(s => !s), []);
  return [state, toggle] as const;
}
