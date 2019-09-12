import * as E from 'fp-ts/lib/Either';
import React from 'react';
import { render } from 'react-dom';
import { inspect } from 'util';

import { EquationEvalSandbox } from './EquationEvalSandbox';

interface EvalEquationError extends Error {
  readonly __brand?: unique symbol;
}
type EvalEquationResult = E.Either<EvalEquationError, number>;

/**
 * @param pointsInAllCategories a record with variables and values
 * @param equation string describing a computation on the variables
 */
export async function evalEquation<PointCategories extends string>(
  pointsInAllCategories: Record<PointCategories, number>,
  equation: string,
  sandboxRoot: HTMLElement = document.body
): Promise<EvalEquationResult> {
  const kvargsString = inspect(pointsInAllCategories);
  const argumentKeys = `(${kvargsString.replace(/\: [\d|(.\d)?]+/g, '')})`;

  const temporaryRoot = document.createElement('div');
  sandboxRoot.appendChild(temporaryRoot);
  const res = await new Promise<EvalEquationResult>(resolve => {
    let settled = false;

    render(
      <EquationEvalSandbox
        equationEvaluationString={`(${argumentKeys} => ${equation})(${kvargsString})`}
        setError={error => {
          if (error) {
            settled = true;
            resolve(E.left(new Error(error)));
          }
        }}
        setResult={result => {
          settled = true;
          resolve(E.right(result));
        }}
      />,
      temporaryRoot,
      () => {
        setTimeout(() => {
          if (!settled) {
            resolve(E.left(new Error('equation evaluation timeout')));
          }
        }, 12000);
      }
    );
  });

  sandboxRoot.removeChild(temporaryRoot);
  return res;
}
