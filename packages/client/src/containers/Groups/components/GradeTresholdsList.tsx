/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Col, Input, Row } from 'antd';
import { Tresholds } from 'common';
import React from 'react';

export const tresholdsKeys: (keyof Tresholds)[] = ['3', '3.5', '4', '4.5', '5'];

type GradeTresholdsListProps = {
  onChange: (value: Tresholds) => void;
  value: Tresholds;
};

export const GradeTresholdsList: React.FC<GradeTresholdsListProps> = ({
  onChange,
  value: tresholds,
}) => {
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
                value={tresholds[key]}
                onChange={event => {
                  onChange({
                    ...tresholds,
                    [key]: Number(event.target.value),
                  });
                }}
              />
            </Col>
          </Row>
        </label>
      ))}
    </section>
  );
};
