import { Button } from 'antd';
import { ApiResponse } from 'common';
import React, { useEffect } from 'react';

import { Flex, LocaleContext, theme } from '../../../components';
import { isSafari } from '../../../utils';
import { meetingsDetailsToCsv } from '../../../utils/meetingsDetailsToCsv';
import { PresenceTable } from '../components/PresenceTable';
import { GroupApiContextState } from '../GroupApiContext';

type Props = GroupApiContextState & {
  editable: boolean;
};

export const MeetingsDetailsSection: React.FC<Props> = ({
  actions,
  meetings,
  meetingsDetails,
  actions: { setStudentMeetingDetails },
  editable,
  currentGroup,
}) => {
  function setStateFromApi() {
    const { listMeetings, getMeetingsDetails } = actions;
    listMeetings();
    getMeetingsDetails();
  }

  const handleSetActivity = withErrorHandler(actions.setActivity);
  const handleAddPresence = withErrorHandler(actions.addPresence);
  const handleDeletePresence = withErrorHandler(actions.deletePresence);

  useEffect(() => {
    setStateFromApi();
  }, [currentGroup]);

  function withErrorHandler<Args extends any[]>(
    func: (...args: Args) => Promise<ApiResponse>
  ) {
    return (...args: Args) =>
      func(...args).then(result => {
        if ('error' in result) {
          setStateFromApi();
        }
        return result;
      });
  }

  function handleMeetingsDetailsCsvDownload() {
    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob(
      [meetingsDetailsToCsv(meetingsDetails || [], meetings || [])],
      { type: mimeType }
    );

    saveAs(blob, `students-meetings-details-${currentGroup!.id}.csv`);
  }

  return (
    <LocaleContext.Consumer>
      {({ texts }) => (
        <Flex
          flexDirection="column"
          padding={theme.Padding.Standard}
          height="100%"
        >
          <Button
            type="primary"
            icon="download"
            onClick={() => handleMeetingsDetailsCsvDownload()}
            aria-label={texts.exportCsv}
            style={{ width: 200, marginBottom: '10px', marginLeft: 1 }}
          >
            {texts.exportCsv}
          </Button>
          <PresenceTable
            editable={editable}
            meetings={meetings}
            meetingsDetails={meetingsDetails}
            setStudentMeetingDetails={setStudentMeetingDetails}
            setActivity={handleSetActivity}
            addPresence={handleAddPresence}
            deletePresence={handleDeletePresence}
          />
        </Flex>
      )}
    </LocaleContext.Consumer>
  );
};
