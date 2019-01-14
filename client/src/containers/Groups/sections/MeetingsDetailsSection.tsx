import { GroupDTO, MeetingDetailsModel, MeetingDTO } from 'common';
import * as React from 'react';

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

  render() {
    const { meetings, meetingsDetails } = this.state;
    return (
      <PresenceTable
        meetings={meetings}
        meetingsDetails={meetingsDetails}
        setMeetingsDetails={this.setMeetingsDetails}
        setActivity={groupService.setActivity}
        addPresence={groupService.addPresence}
        deletePresence={groupService.deletePresence}
      />
    );
  }
}
