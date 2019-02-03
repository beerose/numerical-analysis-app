import { ApiResponse } from 'common';
import * as React from 'react';

import { PresenceTable } from '../components';
import { GroupContextState } from '../GroupApiContext';

type Props = GroupContextState;

export class MeetingsDetailsSections extends React.Component<Props> {
  handleSetActivity = this.withErrorHandler(this.props.apiActions.setActivity);
  handleAddPresence = this.withErrorHandler(this.props.apiActions.addPresence);
  handleDeletePresence = this.withErrorHandler(
    this.props.apiActions.deletePresence
  );

  setStateFromApi() {
    const { listMeetings, getMeetingsDetails } = this.props.apiActions;
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

  render() {
    const {
      meetings,
      meetingsDetails,
      actions: { setMeetingDetails },
    } = this.props;
    return (
      <PresenceTable
        meetings={meetings}
        meetingsDetails={meetingsDetails}
        setMeetingsDetails={setMeetingDetails}
        setActivity={this.handleSetActivity}
        addPresence={this.handleAddPresence}
        deletePresence={this.handleDeletePresence}
      />
    );
  }
}
