import {
  ApiResponse,
  GroupDTO,
  MeetingDetailsModel,
  MeetingDTO,
  UserRole,
} from 'common';
import { Moment } from 'moment';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import * as groupsService from '../../api/groupApi';
import * as usersService from '../../api/userApi';
import { showMessage } from '../../utils';

import { GroupApiContext, GroupContextState } from './GroupApiContext';

const noGroupError = 'No group in state.';

export class GroupApiProvider extends React.Component<
  RouteChildrenProps,
  GroupContextState
> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      actions: {
        goToGroupsPage: this.goToGroupsPage,
        setMeetingDetails: this.setMeetingsDetails,
      },
      apiActions: {
        addMeeting: this.addMeeting,
        addPresence: this.addPresence,
        createGroup: this.createGroup,
        deleteGroup: this.deleteGroup,
        deleteMeeting: this.deleteMeeting,
        deletePresence: this.deletePresence,
        getGroup: this.getGroup,
        getMeetingsDetails: this.getMeetingsDetails,
        listGroups: this.listGroups,
        listMeetings: this.listMeetings,
        listSuperUsers: this.listSuperUsers,
        setActivity: this.setActivity,
        updateMeeting: this.updateMeeting,
      },
      error: false,
      isLoading: false,
      superUsers: [],
    };
  }

  goToGroupsPage = () => {
    this.props.history.push('/groups');
  };

  createGroup = ({
    academic_year,
    group_name,
    group_type,
    lecturer_id,
  }: Pick<
    GroupDTO,
    'academic_year' | 'group_name' | 'group_type' | 'lecturer_id'
  >) => {
    this.setState({ isLoading: true });
    groupsService
      .addGroup({
        academic_year,
        group_name,
        group_type,
        lecturer_id,
      })
      .then(res => {
        this.setState({ isLoading: false });
        if (!('error' in res)) {
          this.props.history.push(`/groups/${res.group_id}`);
        }
      });
  };

  listSuperUsers = () =>
    usersService.listUsers({ roles: UserRole.superUser }).then(res => {
      this.setState({ superUsers: res.users });
    });

  getGroup = () => {
    const groupId = Number(this.props.location.pathname.split('/')[2]);
    groupsService.getGroup(groupId).then(res => {
      if ('error' in res) {
        showMessage(res);
        this.props.history.push('/groups/');
      }
      this.setState({ currentGroup: res });
    });
  };

  listGroups = () => {
    this.setState({ isLoading: true });
    groupsService
      .listGroups()
      .then(res => {
        this.setState({ groups: res.groups, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  };

  deleteGroup = (id: GroupDTO['id']) => {
    this.setState({ isLoading: true });
    groupsService.deleteGroup(id).then(() => {
      this.listGroups();
    });
  };

  addPresence = (
    studentId: number,
    meetingId: number
  ): Promise<ApiResponse> => {
    return groupsService.addPresence(studentId, meetingId);
  };

  deletePresence = (
    studentId: number,
    meetingId: number
  ): Promise<ApiResponse> => {
    return groupsService.deletePresence(studentId, meetingId);
  };

  setActivity = (
    studentId: number,
    meetingId: number,
    points: number
  ): Promise<ApiResponse> => {
    return groupsService.setActivity(studentId, meetingId, points);
  };

  listMeetings = () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    groupsService.listMeetings(this.state.currentGroup.id).then(meetings => {
      this.setState({ meetings });
    });
  };

  getMeetingsDetails = () => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    groupsService.getMeetingsDetails(this.state.currentGroup.id).then(res => {
      this.setState({ meetingsDetails: res });
    });
  };

  setMeetingsDetails = (newDetails: MeetingDetailsModel[]) => {
    this.setState({ meetingsDetails: newDetails });
  };

  addMeeting = async (values: { name: string; date: Moment }) => {
    if (!this.state.currentGroup) {
      throw new Error(noGroupError);
    }
    this.setState({ isLoading: true });
    await groupsService.addMeeting(values, this.state.currentGroup.id);
    this.setState({ isLoading: false });
  };

  deleteMeeting = async (id: MeetingDTO['id']) => {
    this.setState({ isLoading: true });
    await groupsService.deleteMeeting(id);
    this.setState({ isLoading: false });
  };

  updateMeeting = async (values: Pick<MeetingDTO, 'id' & 'name' & 'date'>) => {
    this.setState({ isLoading: true });
    await groupsService.updateMeeting(values);
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <GroupApiContext.Provider value={this.state}>
        {this.props.children}
      </GroupApiContext.Provider>
    );
  }
}
