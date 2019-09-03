import { Spin } from 'antd';
import { MeetingDetailsModel, MeetingDTO, UserDTO, UserId } from 'common';
import { Brand } from 'nom-ts';
import React from 'react';

import { PaddingContainer } from '../../../../components/PaddingContainer';

import { MeetingId } from './types';
import { MeetingsMissingInfo } from './MeetingsMissingInfo';
import {
  PresenceAndActivityChangeHandler,
  PresenceAndActivityControls,
  PresenceAndActivityControlsProps,
} from './PresenceAndActivityControls';
import { PresenceTableStateProvider } from './PresenceTableStateContext';
import { StudentsAtMeetingsTable } from './StudentsAtMeetingsTable';

type ActivityNumber = Brand<number, 'ActivityNumber'>;

const makeRenderCheckboxAndInput = (
  meetingId: MeetingId,
  handleChange: PresenceAndActivityControlsProps['onChange'],
  editable: boolean
) => (
  meetingData: MeetingDetailsModel['data'],
  record: MeetingDetailsModel,
  _index: number
) => {
  return (
    <PresenceAndActivityControls
      editable={editable}
      meetingId={meetingId}
      studentId={record.student.id}
      onChange={handleChange}
      activity={meetingData.activities[meetingId]}
      isPresent={meetingData.presences.has(meetingId)}
    />
  );
};

export type PresenceTableProps = {
  meetings?: MeetingDTO[];
  meetingsDetails?: MeetingDetailsModel[];
  setStudentMeetingDetails: (
    studentId: number,
    newStudentMeetingDetails: MeetingDetailsModel
  ) => void;
  addPresence: (userId: UserId, meetingId: number) => void;
  deletePresence: (userId: UserId, meetingId: number) => void;
  setActivity: (userId: UserId, meetingId: number, activity: number) => void;
  editable: boolean;
};
export class PresenceTable extends React.Component<PresenceTableProps> {
  // TODO: Move this logic into GroupApiContextProvider and remove PresenceTableContext
  handleChange: PresenceAndActivityChangeHandler = data => {
    const {
      meetingsDetails,
      addPresence,
      deletePresence,
      setActivity,
      setStudentMeetingDetails,
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
      const activity = (data as { activity: number }).activity;

      newMeetingData.activities = {
        ...newMeetingData.activities,
        [meetingId]: activity,
      };

      setActivity(studentId, meetingId, activity);
    }

    setStudentMeetingDetails(changedStudentIndexInArray, newStudent);
  };

  render() {
    const { meetings, meetingsDetails, editable } = this.props;

    if (!meetings || !meetingsDetails) {
      return <Spin />;
    }

    if (!meetings.length) {
      return <MeetingsMissingInfo />;
    }

    // TODO: useMemo dependent on this.props
    const contextValue = {
      onChange: this.handleChange,
      value: this.props,
    };

    return (
      <PresenceTableStateProvider value={contextValue}>
        <StudentsAtMeetingsTable
          meetings={meetings}
          meetingsDetails={meetingsDetails}
          makeRenderMeetingData={makeRenderCheckboxAndInput}
          handleChange={this.handleChange}
          editable={editable}
        />
      </PresenceTableStateProvider>
    );
  }
}
