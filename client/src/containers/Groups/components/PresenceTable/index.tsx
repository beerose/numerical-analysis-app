import { Spin } from 'antd';
import { MeetingDetailsModel, MeetingDTO } from 'common';
import React from 'react';

import { PaddingContainer } from '../../../../components/PaddingContainer';

import { MeetingId, PresencesAndActivities } from './types';
import {
  PresenceAndActivityChangeHandler,
  PresenceAndActivityControls,
  PresenceAndActivityControlsProps,
} from './PresenceAndActivityControls';
import { StudentsAtMeetingsTable } from './StudentsAtMeetingsTable';

type ActivityNumber = number & { __brand: 'ActivityNumber' };
const boundActivity = (num: number) =>
  Math.max(-99, Math.min(99, num)) as ActivityNumber;

const makeRenderCheckboxAndInput = (
  meetingId: MeetingId,
  handleChange: PresenceAndActivityControlsProps['onChange']
) => (
  meetingData: MeetingDetailsModel['data'],
  record: MeetingDetailsModel,
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
  setMeetingsDetails: (details: MeetingDetailsModel[]) => void;
  addPresence: (userId: string, meetingId: number) => void;
  deletePresence: (userId: string, meetingId: number) => void;
  setActivity: (userId: string, meetingId: number, activity: number) => void;
};

export class PresenceTable extends React.Component<PresenceTableProps> {
  handleChange: PresenceAndActivityChangeHandler = data => {
    const {
      meetingsDetails,
      addPresence,
      deletePresence,
      setActivity,
      setMeetingsDetails,
    } = this.props;
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

        addPresence(studentId, meetingId);
      } else {
        newMeetingData.presences.delete(meetingId);

        deletePresence(studentId, meetingId);
      }
    } else {
      const activity = boundActivity((data as { activity: number }).activity);

      newMeetingData.activities = {
        ...newMeetingData.activities,
        [meetingId]: activity,
      };

      setActivity(studentId, meetingId, activity);
    }

    const newStudents = [...meetingsDetails];
    newStudents[changedStudentIndexInArray] = newStudent;

    setMeetingsDetails(newStudents);
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
      <PaddingContainer>
        <StudentsAtMeetingsTable
          meetings={meetings}
          meetingsDetails={meetingsDetails}
          makeRenderMeetingData={makeRenderCheckboxAndInput}
          handleChange={this.handleChange}
        />
      </PaddingContainer>
    );
  }
}