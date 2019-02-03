import { ApiResponse, GroupDTO, UserRole } from 'common';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import * as groupsService from '../../api/groupApi';
import * as usersService from '../../api/userApi';
import { showMessage } from '../../utils';

import { GroupApiContext, GroupContextState } from './GroupApiContext';

export class GroupApiProvider extends React.Component<
  RouteChildrenProps,
  GroupContextState
> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      actions: {
        goToGroupsPage: this.goToGroupsPage,
      },
      apiActions: {
        addPresence: this.addPresence,
        createGroup: this.createGroup,
        deleteGroup: this.deleteGroup,
        deletePresence: this.deletePresence,
        getGroup: this.getGroup,
        listGroups: this.listGroups,
        listSuperUsers: this.listSuperUsers,
        setActivity: this.setActivity,
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

  render() {
    return (
      <GroupApiContext.Provider value={this.state}>
        {this.props.children}
      </GroupApiContext.Provider>
    );
  }
}
