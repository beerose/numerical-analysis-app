/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Col, Input, Row } from 'antd';
import { Tresholds } from 'common';
import React, { useCallback } from 'react';
import { debounce } from 'ts-debounce';

import { showMessage } from '../../../utils';

const showBadTresholdsError = debounce(
  () =>
    showMessage({
      error: 'Grade tresholds list should be non-decreasing',
    }),
  1000
);

export const tresholdsKeys: (keyof Tresholds)[] = ['3', '3.5', '4', '4.5', '5'];

type GradeTresholdsListProps = {
  onChange: (value: Tresholds) => void;
  value: Tresholds;
};

export const GradeTresholdsList: React.FC<GradeTresholdsListProps> = ({
  onChange,
  value: tresholds,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { key } = event.target.dataset;

      if (!key) {
        throw new Error('data-key is required on grade treshold input');
      }

      const newVal = Number(event.target.value);
      const leftKey = String(Number(key) - 1);
      const rightKey = String(Number(key) - 1);

      if (
        (leftKey in tresholds &&
          tresholds[leftKey as keyof Tresholds] > newVal) ||
        (rightKey in tresholds &&
          tresholds[rightKey as keyof Tresholds] < newVal)
      ) {
        showBadTresholdsError();
      }

      onChange({
        ...tresholds,
        [key]: newVal,
      });
    },
    [tresholds]
  );

  return (
    <section>
      {tresholdsKeys.map(key => (
        <label key={key}>
          <Row gutter={8}>
            <Col
              span={1}
              css={css`
                display: flex;
                justify-content: flex-end;
                align-items: center;
                height: 32px;
              `}
            >
              <b>{key}</b>
            </Col>
            <Col span={4}>
              <Input
                type="number"
                data-key={key}
                value={tresholds[key]}
                onChange={handleChange}
                min={0}
                max={100}
              />
            </Col>
            <Col span={4}>
              <span
                css={css`
                  padding-top: 6px;
                  display: flex;
                  align-items: center;
                `}
              >
                %
              </span>
            </Col>
          </Row>
        </label>
      ))}
    </section>
  );
};
