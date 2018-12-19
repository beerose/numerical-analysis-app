import { Checkbox, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React from 'react';
import styled, { css } from 'react-emotion';

import { MeetingDTO } from '../../../../../../common/api';

import { fakeLoadedStudents, fakeMeetings } from './fakes';
import {
  BoxedKey,
  BoxedPresencesAndActivities,
  BoxedStudent,
  FieldIdentifier,
  MeetingId,
  PresencesAndActivities,
} from './types';
import { StudentsAtMeetingsTable } from './StudentsAtMeetingsTable';

type ActivityNumber = number & { __brand: 'ActivityNumber' };
const boundActivity = (num: number) => Math.max(-99, Math.min(99, num)) as ActivityNumber;

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

type MeetingDataChangeHandler = (
  value: FieldIdentifier &
    (
      | {
          activity: number;
        }
      | {
          isPresent: boolean;
        })
) => void;

type MeetingDataControlsProps = FieldIdentifier & {
  activity: number;
  isPresent: boolean;
  onChange: MeetingDataChangeHandler;
};

class MeetingDataControls extends React.PureComponent<MeetingDataControlsProps> {
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
    const { isPresent, activity, meetingId } = this.props;

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

const makeRenderCheckboxAndInput = (
  meetingId: MeetingId,
  handleChange: MeetingDataControlsProps['onChange']
) => (
  meetingData: PresencesAndActivities,
  record: BoxedStudent & BoxedPresencesAndActivities,
  _index: number
) => {
  return (
    <MeetingDataControls
      meetingId={meetingId}
      studentId={record.student.id}
      onChange={handleChange}
      activity={meetingData.activities[meetingId]}
      isPresent={meetingData.presences.has(meetingId)}
    />
  );
};

type PresenceTableProps = {};

type State = {
  loadedStudents: Array<BoxedStudent & BoxedPresencesAndActivities & BoxedKey>;
  meetings: MeetingDTO[];
};

export class PresenceTable extends React.Component<PresenceTableProps, State> {
  state = {
    loadedStudents: fakeLoadedStudents,
    meetings: fakeMeetings,
  };

  handleChange: MeetingDataChangeHandler = data => {
    const { loadedStudents } = this.state;
    const { meetingId, studentId } = data;

    const changedStudentIndexInArray = loadedStudents.findIndex(
      student => student.key === studentId
    );
    const newStudent = { ...loadedStudents[changedStudentIndexInArray] };
    const newMeetingData = { ...newStudent.meetingData };
    newStudent.meetingData = newMeetingData;

    const { isPresent } = data as { isPresent?: boolean };
    if (isPresent != null) {
      newMeetingData.presences = new Set(newMeetingData.presences);
      if (isPresent) {
        newMeetingData.presences.add(meetingId);

        console.log('TODO: post api/presence', data);
      } else {
        newMeetingData.presences.delete(meetingId);

        console.log('TODO: delete api/presence', data);
      }
    } else {
      const activity = boundActivity((data as { activity: number }).activity);

      newMeetingData.activities = { ...newMeetingData.activities, [meetingId]: activity };

      console.log('TODO: post api/activity', { ...data, activity });
    }

    const newStudents = [...loadedStudents];
    newStudents[changedStudentIndexInArray] = newStudent;
    this.setState({ loadedStudents: newStudents });
  };

  render() {
    const { meetings, loadedStudents } = this.state;

    return (
      <StudentsAtMeetingsTable
        meetings={meetings}
        loadedStudents={loadedStudents}
        makeRenderMeetingData={makeRenderCheckboxAndInput}
        handleChange={this.handleChange}
      />
    );
  }
}
