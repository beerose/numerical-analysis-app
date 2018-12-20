import React from 'react';

import { MeetingDTO } from '../../../../../../common/api';

import { fakeLoadedStudents, fakeMeetings } from './fakes';
import {
  BoxedKey,
  BoxedPresencesAndActivities,
  BoxedStudent,
  MeetingId,
  PresencesAndActivities,
} from './types';
import {
  PresenceAndActivityChangeHandler,
  PresenceAndActivityControls,
  PresenceAndActivityControlsProps,
} from './PresenceAndActivityControls';
import { StudentsAtMeetingsTable } from './StudentsAtMeetingsTable';

type ActivityNumber = number & { __brand: 'ActivityNumber' };
const boundActivity = (num: number) => Math.max(-99, Math.min(99, num)) as ActivityNumber;

const makeRenderCheckboxAndInput = (
  meetingId: MeetingId,
  handleChange: PresenceAndActivityControlsProps['onChange']
) => (
  meetingData: PresencesAndActivities,
  record: BoxedStudent & BoxedPresencesAndActivities,
  _index: number
) => {
  return (
    <PresenceAndActivityControls
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

  handleChange: PresenceAndActivityChangeHandler = data => {
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
