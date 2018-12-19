import { Checkbox as AntCheckbox, Input as AntInput, Table } from 'antd';
import {
  AbstractCheckboxProps,
  CheckboxChangeEvent,
  CheckboxChangeEventTarget,
} from 'antd/lib/checkbox/Checkbox';
import { InputProps } from 'antd/lib/input';
import React from 'react';
import styled from 'react-emotion';

import { fakeLoadedStudents, fakeMeetings } from './fakes';
import {
  BoxedPresencesAndActivities,
  BoxedStudent,
  FieldIdentifier,
  IdentifiedChangeHandler,
  MeetingId,
} from './types';
import { StudentsAtMeetingsTable } from './StudentsAtMeetingsTable';

type MarkedCheckboxChangeEventTarget = CheckboxChangeEventTarget & FieldIdentifier;

interface MarkedCheckboxChangeEvent extends CheckboxChangeEvent {
  target: MarkedCheckboxChangeEventTarget;
  indeterminate?: boolean;
}

const Checkbox = (AntCheckbox as any) as React.ComponentType<
  FieldIdentifier & AbstractCheckboxProps<MarkedCheckboxChangeEvent>
>;

const Input = (AntInput as any) as React.ComponentType<FieldIdentifier & InputProps>;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const makeRenderCheckboxAndInput = (
  meetingId: MeetingId,
  handleChange: (event: { target: MarkedCheckboxChangeEventTarget }) => void
) => (presences: Set<MeetingId>, record: BoxedStudent & BoxedPresencesAndActivities) => {
  const identifier = {
    meetingId,
    studentId: record.student.id,
  };

  return (
    <ControlsContainer>
      <Checkbox
        identifier={identifier}
        checked={presences.has(meetingId)}
        onChange={handleChange}
      />
      <Input type="number" identifier={identifier} onChange={handleChange} />
    </ControlsContainer>
  );
};

export class PresenceTable extends React.Component {
  handleChange: IdentifiedChangeHandler = event => {
    const { identifier, checked, value } = event.target;
    console.log({
      identifier,
      checked,
      value,
    });
  };

  render() {
    return (
      <StudentsAtMeetingsTable
        meetings={fakeMeetings}
        loadedStudents={fakeLoadedStudents}
        makeRenderMeetingData={makeRenderCheckboxAndInput}
        handleChange={event => console.log(event.target)}
      />
    );
  }
}
