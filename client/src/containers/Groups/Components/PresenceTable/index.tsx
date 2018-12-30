import { Spin } from 'antd';
import React from 'react';

import { MeetingDetailsDTO, MeetingDetailsModel, MeetingDTO } from '../../../../../../common/api';

import { fakeLoadedStudents } from './fakes';
import {
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

type PresenceTableProps = {
  meetings?: MeetingDTO[];
  meetingsDetails?: MeetingDetailsModel[];
};

export class PresenceTable extends React.Component<PresenceTableProps> {
  handleChange: PresenceAndActivityChangeHandler = data => {
    const { meetingsDetails } = this.props;
    if (!meetingsDetails) {
      return;
    }
    const { meetingId, studentId } = data;

    const changedStudentIndexInArray = meetingsDetails.findIndex(
      item => item.student.id === studentId
    );
    const newStudent = { ...meetingsDetails[changedStudentIndexInArray] };
    const newMeetingData = { ...newStudent.data };
    newStudent.data = newMeetingData;

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

    const newStudents = [...meetingsDetails];
    newStudents[changedStudentIndexInArray] = newStudent;
    this.setState({ loadedStudents: newStudents });
  };

  render() {
    const { meetings, meetingsDetails } = this.props;

    if (!meetings || !meetingsDetails) {
      return <Spin />;
    }

    if (!meetings.length) {
      return <div>Nie ma spotkań</div>;
    }

    return (
      <StudentsAtMeetingsTable
        meetings={meetings}
        meetingsDetails={meetingsDetails}
        makeRenderMeetingData={makeRenderCheckboxAndInput}
        handleChange={this.handleChange}
      />
    );
  }
}
