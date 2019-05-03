/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Col, Input, Row } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { ColProps } from 'antd/lib/col';
import React, { useCallback, useState } from 'react';
import { inspect } from 'util';

import { Code } from '../../../components/Code';
import { ExperimentalToggle } from '../../../components/ExperimentalToggle';
import { Colors, LABELS } from '../../../utils';
import { Fonts } from '../../../utils/fonts';

import { EquationEvalSandbox } from './EquationEvalSandbox';

const TextArea = styled(Input.TextArea)`
  box-sizing: content-box;
  font-family: ${Fonts.Monospace};
  margin-bottom: 0 !important;
  min-height: 1.4em !important;
  overflow: hidden;
`;

const LeftColumn = (props: ColProps) => (
  <Col xxl={4} md={16} xs={16} {...props} />
);
const RightColumn = (props: ColProps) => <Col md={19} xxl={16} {...props} />;

type ErrorMessage = string; // '' means no error

type GroupEquationProps = {
  value: string;
  onChange: (value: string) => void;
  onErrorChange: (error: ErrorMessage) => void;
  error: ErrorMessage;
};
// tslint:disable-next-line:max-func-body-length
export const GradeEquationInput: React.FC<GroupEquationProps> = ({
  value: equation,
  onChange: setEquation,
  onErrorChange: setError,
  error,
}) => {
  const [result, setResult] = useState<number | null>(null);
  const [testMode, setTestMode] = useState(false);

  const toggleTestMode = useCallback(() => setTestMode(!testMode), [testMode]);
  const handleEquationChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setEquation(event.target.value),
    [setEquation]
  );

  const [kvargs, _setKvargs] = useState({
    activity: 1,
    presence: 1,
    tasks: 1,
  });
  const setKvargs = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object') {
          _setKvargs(parsed);
        }
      } catch {
        // We can totally ignore error here.
      }
    },
    []
  );

  const kvargsString = inspect(kvargs);
  const argumentKeys = `(${kvargsString.replace(/\: [\d]+/g, '')})`;

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
          <TextArea rows={1} value={equation} onChange={handleEquationChange} />
        </RightColumn>
      </Row>
      <EquationEvalSandbox
        equationString={`(${argumentKeys} => ${equation})(${kvargsString})`}
        setResult={setResult}
        setError={setError}
      />
      <Row gutter={8}>
        <LeftColumn>{testMode && <b>Wynik</b>}</LeftColumn>
        <RightColumn>
          <Code>
            <output>
              {error || equation.length === 0 ? (
                <span style={{ color: Colors.Red }}>
                  {equation.length
                    ? error && error.toString()
                    : LABELS.equationCantBeEmpty}
                </span>
              ) : (
                testMode && result
              )}
            </output>
          </Code>
          {testMode && (
            <div
              css={css`
                margin-bottom: 1em;
              `}
            >
              <span>Testowe dane</span>
              <TextArea
                rows={1}
                value={JSON.stringify(kvargs)}
                onChange={setKvargs}
              />
            </div>
          )}
        </RightColumn>
      </Row>
    </section>
  );
};
