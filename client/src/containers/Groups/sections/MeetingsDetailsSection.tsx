import * as React from 'react';

import { GroupDTO, MeetingDTO, UserDTO } from '../../../../../common/api';
import * as groupService from '../../../api/groupApi';
import { PresenceTable } from '../components';

type Props = {
  groupId: GroupDTO['id'];
};

type State = {
  meetings?: MeetingDTO[];
  studentsWithDetails: Array<
    UserDTO & {
      meetingData: {
        activities: Record<MeetingDTO['id'], number>;
        presences: Set<MeetingDTO['id']>;
      };
    }
  >;
  isLoading: boolean;
};
export class MeetingsDetailsSections extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    studentsWithDetails: [],
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    groupService.listMeetings(this.props.groupId).then(res => {
      this.setState({
        isLoading: false,
        meetings: res,
      });
    });
    groupService.getMeetingsDetails(this.props.groupId).then(res => {
      console.log(res);
    });
  }

  render() {
    const { meetings } = this.state;
    return <PresenceTable meetings={meetings} />;
  }
}
