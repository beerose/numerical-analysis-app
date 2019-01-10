/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Menu } from 'antd';
import { IconProps } from 'antd/lib/icon';
import { GroupDTO, ServerRoutes } from 'common';
import { PropsOf } from 'props-of';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';

import { groupsService } from '../../api';
import { Breadcrumbs, NotFoundPage } from '../../components';
import { LocaleContext } from '../../components/locale';
import { Theme } from '../../components/theme';
import { Flex } from '../../components/Flex';

import {
  MeetingsDetailsSections,
  MeetingsSection,
  StudentsSection,
} from './sections';

// tslint:disable-next-line:no-submodule-imports
// type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;

type MenuLinkProps = {
  to: LinkProps['to'];
} & PropsOf<typeof Menu.Item>;

const MenuLink = ({ children, to, ...rest }: MenuLinkProps) => (
  <Menu.Item {...rest}>
    <Link to={to}>{children}</Link>
  </Menu.Item>
);

const menuStyles = css`
  width: 200px;
`;

type State = {
  groupId: string;
  group?: GroupDTO;
};
export class GroupDetailsContainer extends React.Component<
  RouteComponentProps,
  State
> {
  static contextType = LocaleContext;
  context!: React.ContextType<typeof LocaleContext>;

  state = {
    group: undefined,
    groupId: this.props.location.pathname.split('/')[2],
  };

  componentDidMount() {
    const { groupId } = this.state;
    // TODO: Add lift state for groups higher up,
    // so GroupDetails can use ListGroups's fresh state
    groupsService.getGroup(groupId).then(group => this.setState({ group }));
  }

  goToLists = () => {
    const { groupId } = this.state;
    this.props.history.push(
      `${ServerRoutes.Groups.Get.replace(':id', groupId)}/lists`
    );
  };

  goToMeetings = () => {
    const { groupId } = this.state;
    this.props.history.push(
      `${ServerRoutes.Groups.Get.replace(':id', groupId)}/meetings`
    );
  };

  goToPresence = () => {
    const { groupId } = this.state;
    this.props.history.push(
      `${ServerRoutes.Groups.Get.replace(':id', groupId)}/presence`
    );
  };

  goToGrades = () => {
    const { groupId } = this.state;
    this.props.history.push(
      `${ServerRoutes.Groups.Get.replace(':id', groupId)}/grades`
    );
  };

  getSelectedItem() {
    return this.props.location.pathname.split('/')[3] || 'settings';
  }

  render() {
    const { groupId, group } = this.state;
    const { texts } = this.context;

    // if (!group) {
    //   return (
    //     <Flex flex={1} justifyContent="center" alignItems="center">
    //       <Spin />
    //     </Flex>
    //   );
    // }

    return (
      <Flex flex={1}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[this.getSelectedItem()]}
          css={menuStyles}
        >
          <MenuLink to={'/'}>
            <Icon type="setting" />
            {texts.groupSettings}
          </MenuLink>
          <MenuLink to="students">
            <Icon type="team" />
            {texts.students}
          </MenuLink>
          <Menu.Item key="lists" onClick={this.goToLists}>
            <Icon type="calculator" />
            Listy zadań
          </Menu.Item>
          <Menu.Item key="meetings" onClick={this.goToMeetings}>
            <Icon type="schedule" />
            {texts.meetings}
          </Menu.Item>
          <MenuLink to="presence">
            <Icon type="calendar" />
            {texts.presence}
          </MenuLink>
          <MenuLink to="grades">
            <Icon type="line-chart" />
            {texts.grades}
          </MenuLink>
        </Menu>
        <Flex flexDirection="column" width="100%" overflow="hidden">
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
