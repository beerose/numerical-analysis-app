/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Col, Input, Row } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { ColProps } from 'antd/lib/col';
import React, { useCallback, useState } from 'react';
import html from 'tagged-template-noop';
import { inspect } from 'util';

import { Code } from '../../../components/Code';
import { ExperimentalToggle } from '../../../components/ExperimentalToggle';
import { Sandbox } from '../../../components/Sandbox';
import { Colors } from '../../../utils';
import { Fonts } from '../../../utils/fonts';
import { usePostMessageHandler } from '../../../utils/usePostMessageHandler';

const PostMessageConnectedSandbox = ({ result }: { result: string }) => (
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
        const result = ${result};
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
);

const TextArea = styled(Input.TextArea)`
  box-sizing: content-box;
  font-family: ${Fonts.Monospace};
  margin-bottom: 0 !important;
  min-height: 1.4em !important;
`;

const LeftColumn = (props: ColProps) => (
  <Col xxl={4} md={16} xs={16} {...props} />
);
const RightColumn = (props: ColProps) => <Col md={19} xxl={16} {...props} />;

type ErrorMessage = string;
type Result = number | ErrorMessage;

type GroupEquationProps = {
  value: string;
  onChange: (value: string) => void;
};
export const GroupEquation: React.FC<GroupEquationProps> = ({
  value: equation,
  onChange,
}) => {
  const [result, setResult] = useState<Result | null>(null);
  const [testMode, setTestMode] = useState(false);

  const toggleTestMode = useCallback(() => setTestMode(!testMode), [testMode]);
  const handleEquationChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      onChange(event.target.value),
    [onChange]
  );

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
        <b css={{ verticalAlign: 'text-bottom' }}>Wzór na ocenę</b>
        <ExperimentalToggle value={testMode} onClick={toggleTestMode} />
      </header>
      <Row align="middle" type="flex" gutter={8}>
        <LeftColumn>
          <Code
            inline
            css={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {argumentKeys} =>
          </Code>
        </LeftColumn>
        <RightColumn>
          <TextArea
            rows={1}
            value={equation}
            placeholder="0.6 * activity + 0.3 * presence"
            onChange={handleEquationChange}
          />
        </RightColumn>
      </Row>
      <PostMessageConnectedSandbox
        result={`(${argumentKeys} => ${equation})(${kvargsString})`}
      />
      <Row gutter={8}>
        <LeftColumn>{testMode && <b>Wynik</b>}</LeftColumn>
        <RightColumn>
          <Code>
            <output>
              {typeof result === 'number' ? (
                testMode && result
              ) : (
                <span style={{ color: Colors.Red }}>
                  {equation.length
                    ? result && result.toString()
                    : "Equation can't be empty"}
                </span>
              )}
            </output>
          </Code>
          {testMode && <Code>{kvargsString}</Code>}
        </RightColumn>
      </Row>
    </section>
  );
};
