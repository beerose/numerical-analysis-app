import { Icon, Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import { css } from 'emotion';
import * as React from 'react';
import styled from 'react-emotion';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { ROUTES } from '../../../../../common/api';

import { StudentsSection } from './StudentsSection';

const menuStyles = css`
  width: 200px;
  height: calc(100vh - 64px);
  margin-left: -50px;
`;

const Container = styled.section`
  display: flex;
  flex-direction: row;
`;

type State = {
  groupId: string;
};
export class EditGroupContainer extends React.Component<RouteComponentProps, State> {
  state = {
    groupId: this.props.location.pathname.split('/')[2],
  };

  goToStudents = () => {
    const { groupId } = this.state;
    this.props.history.push(`${ROUTES.GROUPS.details.replace(':id', groupId)}/students`);
  };

  goToLists = () => {
    const { groupId } = this.state;
    this.props.history.push(`${ROUTES.GROUPS.details.replace(':id', groupId)}/lists`);
  };

  goToMeetings = () => {
    const { groupId } = this.state;
    this.props.history.push(`${ROUTES.GROUPS.details.replace(':id', groupId)}/meetings`);
  };

  goToPresence = () => {
    const { groupId } = this.state;
    this.props.history.push(`${ROUTES.GROUPS.details.replace(':id', groupId)}/presence`);
  };

  goToAcitivity = () => {
    const { groupId } = this.state;
    this.props.history.push(`${ROUTES.GROUPS.details.replace(':id', groupId)}/acitivity`);
  };

  goToGrades = () => {
    const { groupId } = this.state;
    this.props.history.push(`${ROUTES.GROUPS.details.replace(':id', groupId)}/grades`);
  };

  getSelectedItem() {
    return this.props.location.pathname.split('/')[3] || 'settings';
  }

  render() {
    return (
      <Container>
        <Menu mode="inline" defaultSelectedKeys={[this.getSelectedItem()]} className={menuStyles}>
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
        <Switch>
          <Route
            exact={true}
            path={'/groups/:id/students'}
            component={() => <StudentsSection groupId={this.state.groupId} />}
          />
        </Switch>
      </Container>
    );
  }
}
