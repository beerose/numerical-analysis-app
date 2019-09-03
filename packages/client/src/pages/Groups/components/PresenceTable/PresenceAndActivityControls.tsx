import styled from '@emotion/styled';
import { Checkbox as AntCheckbox, Input as AntInput } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React from 'react';

import { FieldIdentifier } from './types';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Checkbox = styled(AntCheckbox)`
  margin-right: 4px;

  .ant-checkbox-inner {
    height: 20px;
    width: 20px;
    &::after {
      left: 4px;
      top: 8px;
      width: 6px;
      height: 12px;
    }
  }
`;

const Input = styled(AntInput)`
  width: 76px;
`;

type PresenceOrActivityValue =
  | {
      activity: number;
    }
  | {
      isPresent: boolean;
    };

type PresenceOrActivityChangeEvent = FieldIdentifier & PresenceOrActivityValue;

export type PresenceAndActivityChangeHandler = (
  value: PresenceOrActivityChangeEvent
) => void;

export type PresenceAndActivityControlsProps = FieldIdentifier & {
  activity: number;
  isPresent: boolean;
  onChange: PresenceAndActivityChangeHandler;
  editable: boolean;
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
    const { isPresent, activity, editable } = this.props;

    return (
      <ControlsContainer>
        <Checkbox
          disabled={!editable}
          checked={isPresent}
          onChange={this.handleIsPresentChanged}
        />
        <Input
          disabled={!isPresent || !editable}
          type="number"
          value={activity}
          onChange={this.handleActivityChanged}
          tabIndex={0}
        />
      </ControlsContainer>
    );
  }
}
