import { useEffect } from 'react';

export function usePostMessageHandler(
  handleMessage: (e: MessageEvent) => void,
  inputs: ReadonlyArray<any>
) {
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, inputs);
}
