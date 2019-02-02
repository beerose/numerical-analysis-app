// tslint:disable-next-line:no-single-line-block-comment
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Menu, Spin } from 'antd';
import { GroupDTO, groupFeatures } from 'common';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';

import { groupsService } from '../../api';
import { Breadcrumbs, NotFoundPage } from '../../components';
import { LocaleContext } from '../../components/locale';
import { Theme } from '../../components/theme';
import { Flex } from '../../components/Flex';
import { showMessage } from '../../utils';

import {
  MeetingsDetailsSections,
  MeetingsSection,
  // SettingsSection,
  SettingsSection,
  StudentsSection,
} from './sections';

type MenuLinkProps = {
  to: LinkProps['to'];
} & React.ComponentProps<typeof Menu.Item>;

const MenuLink = ({ children, to, ...rest }: MenuLinkProps) => (
  <Menu.Item {...rest}>
    <Link to={to}>{children}</Link>
  </Menu.Item>
);

const menuStyles = css`
  width: 200px;
`;

type State = {
  groupId: GroupDTO['id'];
  group?: GroupDTO;
};
export class GroupDetailsContainer extends React.Component<
  RouteComponentProps,
  State
> {
  static contextType = LocaleContext;
  context!: React.ContextType<typeof LocaleContext>;

  state: State = {
    groupId: Number(this.props.location.pathname.split('/')[2]),
  };

  componentDidMount() {
    const { groupId } = this.state;
    // TODO: lift state for groups higher up,
    // so GroupDetails can use ListGroups's fresh state
    groupsService.getGroup(groupId).then(res => {
      if ('error' in res) {
        showMessage(res);
        this.props.history.push('/groups/');
      }
      this.setState({ group: res });
    });
  }

  getSelectedItem() {
    return this.props.location.pathname.split('/')[3] || 'settings';
  }

  replaceGroupIdBreadcrumb = (s: string) => {
    const { group } = this.state;
    if (!group) {
      return s;
    }
    if (Number(s) === group.id) {
      return group.group_name;
    }
    return s;
  };

  render() {
    const {
      match: { url: matchUrl },
    } = this.props;
    const { groupId, group } = this.state;
    const { texts } = this.context;

    if (!group) {
      return (
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Spin />
        </Flex>
      );
    }

    const features = groupFeatures[group.group_type];

    return (
      <Flex flex={1}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[this.getSelectedItem()]}
          css={menuStyles}
        >
          <MenuLink to={matchUrl} key="settings">
            <Icon type="setting" />
            {texts.groupSettings}
          </MenuLink>
          <MenuLink to={`${matchUrl}/students`} key="students">
            <Icon type="team" />
            {texts.students}
          </MenuLink>
          {features.hasLists && (
            <MenuLink to={`${matchUrl}/lists`} key="lists">
              <Icon type="calculator" />
              {texts.lists}
            </MenuLink>
          )}
          {features.hasMeetings && (
            <MenuLink to={`${matchUrl}/meetings`} key="meetings">
              <Icon type="schedule" />
              {texts.meetings}
            </MenuLink>
          )}
          {features.hasPresence && (
            <MenuLink to={`${matchUrl}/presence`} key="presence">
              <Icon type="calendar" />
              {texts.presence}
            </MenuLink>
          )}
          <MenuLink to={`${matchUrl}/grades`} key="grades">
            <Icon type="line-chart" />
            {texts.grades}
          </MenuLink>
        </Menu>
        <Flex flexDirection="column" width="100%" overflow="hidden">
          <Breadcrumbs
            css={css`
              padding: ${Theme.Padding.Half} 0 0 ${Theme.Padding.Standard};
            `}
            replace={this.replaceGroupIdBreadcrumb}
          />
          <Switch>
            <Route exact={true} path={'/groups/:id'}>
              <SettingsSection group={group} />
            </Route>
            <Route exact={true} path={'/groups/:id/students'}>
              <StudentsSection groupId={groupId} />
            </Route>
            <Route exact={true} path={'/groups/:id/presence'}>
              <MeetingsDetailsSections groupId={Number(groupId)} />
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
