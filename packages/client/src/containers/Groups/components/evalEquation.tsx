import React from 'react';
import { render } from 'react-dom';
import { inspect } from 'util';

import { EquationEvalSandbox } from './EquationEvalSandbox';

export function evalEquation<PointCategories extends string>(
  pointsInAllCategories: Record<PointCategories, number>,
  equation: string
): Promise<number> {
  const temporaryRoot = document.createElement('div');

  const kvargsString = inspect(pointsInAllCategories);
  const argumentKeys = `(${kvargsString.replace(/\: [\d]+/g, '')})`;

  return new Promise((resolve, reject) => {
    let settled = false;

    render(
      <EquationEvalSandbox
        equationEvaluationString={`(${argumentKeys} => ${equation})(${kvargsString})`}
        setError={error => {
          settled = true;
          reject(error);
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
}
