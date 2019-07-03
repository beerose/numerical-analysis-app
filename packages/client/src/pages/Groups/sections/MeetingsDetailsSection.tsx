import { Button } from 'antd';
import { ApiResponse } from 'common';
import * as React from 'react';

import { Flex, LocaleContext, theme } from '../../../components';
import { isSafari } from '../../../utils';
import { meetingsDetailsToCsv } from '../../../utils/meetingsDetailsToCsv';
import { PresenceTable } from '../components/PresenceTable';
import { GroupApiContextState } from '../GroupApiContext';

type Props = GroupApiContextState & {
  editable: boolean;
};

export class MeetingsDetailsSections extends React.Component<Props> {
  handleSetActivity = this.withErrorHandler(this.props.actions.setActivity);
  handleAddPresence = this.withErrorHandler(this.props.actions.addPresence);
  handleDeletePresence = this.withErrorHandler(
    this.props.actions.deletePresence
  );

  setStateFromApi() {
    const { listMeetings, getMeetingsDetails } = this.props.actions;
    listMeetings();
    getMeetingsDetails();
  }

  componentDidMount() {
    this.setStateFromApi();
  }

  withErrorHandler<Args extends any[]>(
    func: (...args: Args) => Promise<ApiResponse>
  ) {
    return (...args: Args) =>
      func(...args).then(result => {
        if ('error' in result) {
          this.setStateFromApi();
        }
        return result;
      });
  }

  handleMeetingsDetailsCsvDownload() {
    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob(
      [
        meetingsDetailsToCsv(
          this.props.meetingsDetails || [],
          this.props.meetings || []
        ),
      ],
      { type: mimeType }
    );

    saveAs(
      blob,
      `students-meetings-details-${this.props.currentGroup!.id}.csv`
    );
  }

  render() {
    const {
      meetings,
      meetingsDetails,
      actions: { setStudentMeetingDetails },
      editable,
    } = this.props;

    return (
      <LocaleContext.Consumer>
        {({ texts }) => (
          <Flex flexDirection="column" padding={theme.Padding.Standard}>
            <Button
              type="primary"
              icon="download"
              onClick={() => this.handleMeetingsDetailsCsvDownload()}
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
              setActivity={this.handleSetActivity}
              addPresence={this.handleAddPresence}
              deletePresence={this.handleDeletePresence}
            />
          </Flex>
        )}
      </LocaleContext.Consumer>
    );
  }
}
