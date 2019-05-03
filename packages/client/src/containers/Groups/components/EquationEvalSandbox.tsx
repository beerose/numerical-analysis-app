import React from 'react';

import { Sandbox } from '../../../components/Sandbox';
import { usePostMessageHandler } from '../../../utils/usePostMessageHandler';

export type EquationEvalSandboxProps = {
  equationString: string;
  setError: (_: string) => void;
  setResult: (_: number) => void;
};

export const EquationEvalSandbox = ({
  equationString,
  setError,
  setResult,
}: EquationEvalSandboxProps) => {
  usePostMessageHandler(event => {
    if (event.data.type === 'result') {
      const { value } = event.data;
      if (!isNaN(Number(value))) {
        setError('');
        setResult(Number(value));
      }
    }
    if (event.data.type === 'error') {
      const { value } = event.data;
      if (typeof value === 'string') {
        setError(value);
      }
    }
  }, []);

  return (
    <Sandbox
      srcDoc={
        /* html */ `
        <script>
          window.onerror = err => {
            window.parent.postMessage(
              {
                type: 'error',
                value: err,
              },
              '*'
            );
          };
        </script>
        <script>
          const result = ${equationString};
          window.parent.postMessage(
            {
              type: 'result',
              value: result,
            },
            '*'
          );
        </script>
      `
      }
    />
  );
};
