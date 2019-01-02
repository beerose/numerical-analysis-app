import * as React from 'react';

import { GroupDTO, MeetingDetailsModel, MeetingDTO } from '../../../../../common/api';
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

  componentDidMount() {
    groupService.listMeetings(this.props.groupId).then(res => {
      this.setState({
        meetings: res,
      });
    });
    groupService.getMeetingsDetails(this.props.groupId).then(res => {
      this.setState({
        meetingsDetails: res,
      });
    });
  }

  setMeetingsDetails = (newDetails: MeetingDetailsModel[]) => {
    this.setState({ meetingsDetails: newDetails });
  };

  handleAddPresence = (userId: string, meetingId: number) => {
    groupService.addPresence(userId, meetingId);
  };

  handleDeletePresence = (userId: string, meetingId: number) => {
    groupService.deletePresence(userId, meetingId);
  };

  handleSetActivity = (userId: string, meetingId: number, points: number) => {
    groupService.setActivity(userId, meetingId, points);
  };

  render() {
    const { meetings, meetingsDetails } = this.state;
    return (
      <PresenceTable
        meetings={meetings}
        meetingsDetails={meetingsDetails}
        setMeetingsDetails={this.setMeetingsDetails}
        setActivity={this.handleSetActivity}
        addPresence={this.handleAddPresence}
        deletePresence={this.handleDeletePresence}
      />
    );
  }
}
