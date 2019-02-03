import { ApiResponse, GroupDTO, MeetingDetailsModel, MeetingDTO } from 'common';
import * as React from 'react';

import * as groupService from '../../../api/groupApi';
import { PresenceTable } from '../components';

type Props = {
  groupId: GroupDTO['id'];
  setActivity: (
    studentId: number,
    meetingId: number,
    points: number
  ) => Promise<ApiResponse>;
  addPresence: (studentId: number, meetingId: number) => Promise<ApiResponse>;
  deletePresence: (
    studentId: number,
    meetingId: number
  ) => Promise<ApiResponse>;
};

type State = {
  meetings?: MeetingDTO[];
  meetingsDetails: MeetingDetailsModel[];
};
export class MeetingsDetailsSections extends React.Component<Props, State> {
  state: State = {
    meetingsDetails: [],
  };

  handleSetActivity = this.withErrorHandler(this.props.setActivity);
  handleAddPresence = this.withErrorHandler(this.props.addPresence);
  handleDeletePresence = this.withErrorHandler(this.props.deletePresence);

  setStateFromApi() {
    const { groupId } = this.props;
    groupService.listMeetings(groupId).then(meetings => {
      this.setState({ meetings });
    });
    groupService.getMeetingsDetails(groupId).then(meetingsDetails => {
      this.setState({ meetingsDetails });
    });
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

  handleSetMeetingDetails = (newDetails: MeetingDetailsModel[]) => {
    this.setState({ meetingsDetails: newDetails });
  };

  render() {
    const { meetings, meetingsDetails } = this.state;
    return (
      <PresenceTable
        meetings={meetings}
        meetingsDetails={meetingsDetails}
        setMeetingsDetails={this.handleSetMeetingDetails}
        setActivity={this.handleSetActivity}
        addPresence={this.handleAddPresence}
        deletePresence={this.handleDeletePresence}
      />
    );
  }
}
