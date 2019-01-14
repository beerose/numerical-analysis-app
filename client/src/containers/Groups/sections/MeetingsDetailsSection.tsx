import { message } from 'antd';
import {
  ApiResponse,
  GroupDTO,
  MeetingDetailsModel,
  MeetingDTO,
  UserDTO,
} from 'common';
import * as React from 'react';

import { groupsService } from '../../../api';
import * as groupService from '../../../api/groupApi';
import { PresenceTable } from '../components';

type Props = {
  groupId: GroupDTO['id'];
};

type State = {
  meetings?: MeetingDTO[];
  meetingsDetails: MeetingDetailsModel[];
};
export class MeetingsDetailsSections extends React.Component<Props, State> {
  state: State = {
    meetingsDetails: [],
  };

  handleSetActivity = this.withErrorHandler(groupsService.setActivity);
  handleAddPresence = this.withErrorHandler(groupService.addPresence);
  handleDeletePresence = this.withErrorHandler(groupsService.deletePresence);

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
