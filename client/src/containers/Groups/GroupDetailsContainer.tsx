/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { Routes } from '../../../../common/api';
import { Breadcrumbs, NotFoundPage } from '../../components';
import { Theme } from '../../components/theme';
import { Flex } from '../../components/Flex';

import { MeetingsDetailsSections, MeetingsSection, StudentsSection } from './sections';

const menuStyles = css`
  width: 200px;
`;

type State = {
  groupId: string;
};
export class GroupDetailsContainer extends React.Component<RouteComponentProps, State> {
  state = {
    groupId: this.props.location.pathname.split('/')[2],
  };

  goToStudents = () => {
    const { groupId } = this.state;
    this.props.history.push(`${Routes.Groups.Get.replace(':id', groupId)}/students`);
  };

  goToLists = () => {
    const { groupId } = this.state;
    this.props.history.push(`${Routes.Groups.Get.replace(':id', groupId)}/lists`);
  };

  goToMeetings = () => {
    const { groupId } = this.state;
    this.props.history.push(`${Routes.Groups.Get.replace(':id', groupId)}/meetings`);
  };

  goToPresence = () => {
    const { groupId } = this.state;
    this.props.history.push(`${Routes.Groups.Get.replace(':id', groupId)}/presence`);
  };

  goToAcitivity = () => {
    const { groupId } = this.state;
    this.props.history.push(`${Routes.Groups.Get.replace(':id', groupId)}/acitivity`);
  };

  goToGrades = () => {
    const { groupId } = this.state;
    this.props.history.push(`${Routes.Groups.Get.replace(':id', groupId)}/grades`);
  };

  getSelectedItem() {
    return this.props.location.pathname.split('/')[3] || 'settings';
  }

  render() {
    const { groupId } = this.state;

    return (
      <Flex flex={1}>
        <Menu mode="inline" defaultSelectedKeys={[this.getSelectedItem()]} css={menuStyles}>
          <MenuItem key="settings">
            <Icon type="setting" />
            Ustawienia grupy
          </MenuItem>
          <MenuItem key="students" onClick={this.goToStudents}>
            <Icon type="team" />
            Studenci
          </MenuItem>
          <Menu.Item key="lists" onClick={this.goToLists}>
            <Icon type="calculator" />
            Listy zadań
          </Menu.Item>
          <Menu.Item key="meetings" onClick={this.goToMeetings}>
            <Icon type="schedule" />
            Spotkania
          </Menu.Item>
          <Menu.Item key="presence" onClick={this.goToPresence}>
            <Icon type="calendar" />
            Obecności
          </Menu.Item>
          <Menu.Item key="activity" onClick={this.goToAcitivity}>
            <Icon type="plus" />
            Aktywności
          </Menu.Item>
          <Menu.Item key="grades" onClick={this.goToGrades}>
            <Icon type="line-chart" />
            Oceny
          </Menu.Item>
        </Menu>
        <Flex direction="column">
          <Breadcrumbs
            css={css`
              padding: ${Theme.Padding.Half} 0 0 ${Theme.Padding.Standard};
            `}
          />
          <Switch>
            <Route
              exact={true}
              path={'/groups/:id/students'}
              component={() => <StudentsSection groupId={groupId} />}
            />
            <Route exact={true} path={'/groups/:id/presence'}>
              <MeetingsDetailsSections groupId={groupId} />
            </Route>
            <Route exact={true} path={'/groups/:id/meetings'}>
              <MeetingsSection groupId={groupId} />
            </Route>
            <NotFoundPage />
          </Switch>
        </Flex>
      </Flex>
    );
  }
}
