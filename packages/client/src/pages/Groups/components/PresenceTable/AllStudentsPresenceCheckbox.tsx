import React from 'react';

import { SummaryCheckbox } from '../../../../components/SummaryCheckbox';

import { PresenceTableStateConsumer } from './PresenceTableStateContext';

export type AllStudentsPresenceCheckboxProps = { meetingId: number };
export const AllStudentsPresenceCheckbox: React.FC<
  AllStudentsPresenceCheckboxProps
> = ({ meetingId }) => {
  return (
    <PresenceTableStateConsumer>
      {({ onChange, value }) => {
        const { meetingsDetails: studentsMeetingDetails } = value;

        if (studentsMeetingDetails && studentsMeetingDetails.length) {
          const studentsCount = studentsMeetingDetails.length;
          const presentCount = studentsMeetingDetails
            .map(({ data }) => data.presences.has(meetingId))
            .filter(Boolean).length;

          // TODO: memoize with useContext and useCallback? Profiler
          const handleChange = () => {
            const newValue = presentCount < studentsCount;
            studentsMeetingDetails.forEach(
              ({ data: { presences }, student: { id: studentId } }) => {
                if (presences.has(meetingId) !== newValue) {
                  onChange({ studentId, meetingId, isPresent: newValue });
                }
              }
            );
          };

          return (
            <SummaryCheckbox
              checked={presentCount}
              max={studentsCount}
              onChange={handleChange}
            />
          );
        }

        return null;
      }}
    </PresenceTableStateConsumer>
  );
};
