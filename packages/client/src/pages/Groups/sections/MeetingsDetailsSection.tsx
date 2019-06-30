import { ApiResponse } from 'common';
import * as React from 'react';

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

  render() {
    const {
      meetings,
      meetingsDetails,
      actions: { setStudentMeetingDetails },
      editable,
    } = this.props;

    return (
      <PresenceTable
        editable={editable}
        meetings={meetings}
        meetingsDetails={meetingsDetails}
        setStudentMeetingDetails={setStudentMeetingDetails}
        setActivity={this.handleSetActivity}
        addPresence={this.handleAddPresence}
        deletePresence={this.handleDeletePresence}
      />
    );
  }
}
