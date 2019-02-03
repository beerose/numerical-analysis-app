import { GroupDTO, UserRole } from 'common';
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
        createGroup: this.createGroup,
        getGroup: this.getGroup,
        listSuperUsers: this.listSuperUsers,
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

  render() {
    return (
      <GroupApiContext.Provider value={this.state}>
        {this.props.children}
      </GroupApiContext.Provider>
    );
  }
}
