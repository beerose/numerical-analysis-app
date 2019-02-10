/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Col, Input, Row } from 'antd';
import React from 'react';
import html from 'tagged-template-noop';
import { inspect } from 'util';

import { Code } from '../../../components/Code';
import { Sandbox } from '../../../components/Sandbox';
import { Fonts } from '../../../utils/fonts';
import { usePostMessageHandler } from '../../../utils/usePostMessageHandler';

type ErrorMessage = string;
type Result = number | ErrorMessage;

export const GroupEquation: React.FC = () => {
  const [equation, setEquation] = React.useState('activity + 2');
  const [result, setResult] = React.useState<Result | null>(null);

  const kvargs = {
    activity: 1,
    presence: 1,
  };

  const kvargsString = inspect(kvargs);
  const argumentKeys = `(${kvargsString.replace(/\: [\d]+/g, '')})`;

  usePostMessageHandler(e => {
    if (e.data.type === 'result') {
      const { value } = e.data;
      if (!isNaN(Number(value))) {
        setResult(Number(value));
      }
    }
    if (e.data.type === 'error') {
      const { value } = e.data;
      if (typeof value === 'string') {
        setResult(value);
      }
    }
  }, []);

  return (
    <section>
      <header>
        <b>Wzór na ocenę:</b>
      </header>
      <Row align="middle" type="flex" gutter={8}>
        <Col span={4}>
          <Code inline>{argumentKeys} =></Code>
        </Col>
        <Col span={16}>
          <Input.TextArea
            css={{
              fontFamily: Fonts.Monospace,
              marginBottom: '0 !important',
              minHeight: '1.4em !important',
            }}
            rows={1}
            value={equation}
            placeholder="0.6 * activity + 0.3 * presence"
            onChange={event => {
              setEquation(event.target.value);
            }}
          />
        </Col>
      </Row>
      <Sandbox
        srcDoc={html`
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
            const result = (${argumentKeys} => ${equation})(${kvargsString});
            window.parent.postMessage(
              {
                type: 'result',
                value: result,
              },
              '*'
            );
          </script>
        `}
      />
      <output style={{ background: 'rgba(0,0,0,0.05)' }}>
        {typeof result === 'number' ? (
          result
        ) : (
          <span
            style={{
              color: 'red',
              fontSize: '0.6em',
            }}
          >
            {result && result.toString()}
          </span>
        )}
      </output>
      <Code>{kvargsString}</Code>
    </section>
  );
};
