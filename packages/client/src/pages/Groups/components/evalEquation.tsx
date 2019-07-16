import React from 'react';
import { render } from 'react-dom';
import { inspect } from 'util';

import { EquationEvalSandbox } from './EquationEvalSandbox';

export async function evalEquation<PointCategories extends string>(
  pointsInAllCategories: Record<PointCategories, number>,
  equation: string
) {
  const temporaryRoot = document.createElement('div');
  document.body.appendChild(temporaryRoot);

  const kvargsString = inspect(pointsInAllCategories);
  const argumentKeys = `(${kvargsString.replace(/\: [\d]+/g, '')})`;

  const res = await new Promise<number>((resolve, reject) => {
    let settled = false;

    render(
      <EquationEvalSandbox
        equationEvaluationString={`(${argumentKeys} => ${equation})(${kvargsString})`}
        setError={error => {
          if (error) {
            settled = true;
            reject(error);
          }
        }}
        setResult={result => {
          settled = true;
          resolve(result);
        }}
      />,
      temporaryRoot,
      () => {
        setTimeout(() => {
          if (!settled) {
            reject('equation evaluation timeout');
          }
        }, 2000);
      }
    );
  });

  document.body.removeChild(temporaryRoot);
  return res;
}
