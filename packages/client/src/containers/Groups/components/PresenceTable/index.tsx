import { Spin } from 'antd';
import { MeetingDetailsModel, MeetingDTO, UserDTO } from 'common';
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

export type PresenceTableProps = {
  meetings?: MeetingDTO[];
  meetingsDetails?: MeetingDetailsModel[];
  setStudentMeetingDetails: (
    studentId: number,
    newStudentMeetingDetails: MeetingDetailsModel
  ) => void;
  addPresence: (userId: UserDTO['id'], meetingId: number) => void;
  deletePresence: (userId: UserDTO['id'], meetingId: number) => void;
  setActivity: (
    userId: UserDTO['id'],
    meetingId: number,
    activity: number
  ) => void;
};

export class PresenceTable extends React.Component<PresenceTableProps> {
  // TODO: Move this logic into GroupApiContextProvider and remove PresenceTableContext
  // Issue link: https://www.notion.so/mylifeasoctopus/Remove-PresenceTableStateContext-and-move-logic-from-PresenceTable-up-to-GroupApiContext-Create-batch-presence-update-endpoints-click-for-more-info-4ceeaae14bf740259cf1cdf7e8d0ac78
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
      const activity = boundActivity((data as { activity: number }).activity);

      newMeetingData.activities = {
        ...newMeetingData.activities,
        [meetingId]: activity,
      };

      setActivity(studentId, meetingId, activity);
    }

    setStudentMeetingDetails(changedStudentIndexInArray, newStudent);
  };

  render() {
    const { meetings, meetingsDetails } = this.props;

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
      <PaddingContainer>
        <PresenceTableStateProvider value={contextValue}>
          <StudentsAtMeetingsTable
            meetings={meetings}
            meetingsDetails={meetingsDetails}
            makeRenderMeetingData={makeRenderCheckboxAndInput}
            handleChange={this.handleChange}
          />
        </PresenceTableStateProvider>
      </PaddingContainer>
    );
  }
}
