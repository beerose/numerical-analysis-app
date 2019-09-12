import React, { useState } from 'react';

import { Sandbox } from '../../../components/Sandbox';
import { usePostMessageHandler } from '../../../utils/usePostMessageHandler';

export type EquationEvalSandboxProps = {
  equationEvaluationString: string;
  setError: (_: string) => void;
  setResult: (_: number) => void;
};

// TODO: replace with an uuid
let uuid = 0;

export const EquationEvalSandbox = ({
  equationEvaluationString,
  setError,
  setResult,
}: EquationEvalSandboxProps) => {
  // tslint:disable-next-line:no-increment-decrement
  const [computationId] = useState(() => uuid++);

  usePostMessageHandler(event => {
    if (event.data.computationId !== computationId) {
      return;
    }

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
                computationId: ${computationId},
              },
              '*'
            );
          };
        </script>
        <script>
          const result = ${equationEvaluationString};
          window.parent.postMessage(
            {
              type: 'result',
              value: result,
              computationId: ${computationId},
            },
            '*'
          );
        </script>
      `
      }
    />
  );
};
