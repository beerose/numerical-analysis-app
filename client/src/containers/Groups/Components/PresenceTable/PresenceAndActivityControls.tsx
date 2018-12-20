import { Checkbox, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React from 'react';
import styled, { css } from 'react-emotion';

import { FieldIdentifier } from './types';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LargeCheckbox = styled(Checkbox)`
  margin-right: 4px;

  .ant-checkbox-inner {
    height: 20px;
    width: 20px;
    &::after {
      left: 6px;
      top: 2px;
      width: 6px;
      height: 12px;
    }
  }
`;

export type PresenceAndActivityChangeHandler = (
  value: FieldIdentifier &
    (
      | {
          activity: number;
        }
      | {
          isPresent: boolean;
        })
) => void;

export type PresenceAndActivityControlsProps = FieldIdentifier & {
  activity: number;
  isPresent: boolean;
  onChange: PresenceAndActivityChangeHandler;
};

export class PresenceAndActivityControls extends React.PureComponent<
  PresenceAndActivityControlsProps
> {
  // todo: use bind decorator and compare performance
  handleIsPresentChanged = (event: CheckboxChangeEvent) => {
    const { meetingId, studentId, onChange } = this.props;
    const { checked } = event.target;

    onChange({
      meetingId,
      studentId,
      isPresent: checked,
    });
  };

  handleActivityChanged: React.ChangeEventHandler<HTMLInputElement> = event => {
    const { meetingId, studentId, onChange } = this.props;
    const { value } = event.target;

    onChange({
      meetingId,
      studentId,
      activity: Number(value),
    });
  };

  render() {
    const { isPresent, activity } = this.props;

    return (
      <ControlsContainer>
        <LargeCheckbox checked={isPresent} onChange={this.handleIsPresentChanged} />
        <Input
          disabled={!isPresent}
          type="number"
          value={activity}
          onChange={this.handleActivityChanged}
          className={css`
            width: 56px;
          `}
          tabIndex={Math.floor(Math.random() * 100)}
        />
      </ControlsContainer>
    );
  }
}
