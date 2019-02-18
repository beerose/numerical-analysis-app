// tslint:disable-next-line:no-single-line-block-comment
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Menu, Spin } from 'antd';
import { groupFeatures } from 'common';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';

import { Breadcrumbs, NotFoundPage } from '../../components';
import { LocaleContext } from '../../components/locale';
import { Theme } from '../../components/theme';
import { Flex } from '../../components/Flex';

import { NewTaskForm } from './components';
import {
  MeetingsDetailsSections,
  MeetingsSection,
  SettingsSection,
  StudentsSection,
  TasksSection,
  TestsSection,
} from './sections';
import { TaskSection } from './sections/TaskSection';
import { GroupApiContext, GroupApiContextState } from './GroupApiContext';

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

export class GroupDetailsContainer extends React.Component<
  RouteComponentProps
> {
  static contextType = GroupApiContext;
  context!: GroupApiContextState;

  componentDidMount() {
    this.context.actions.getGroup();
  }

  getSelectedItem() {
    return this.props.location.pathname.split('/')[3] || 'settings';
  }

  replaceGroupIdBreadcrumb = (s: string) => {
    const { currentGroup } = this.context;
    if (!currentGroup) {
      return s;
    }
    if (Number(s) === currentGroup.id) {
      return currentGroup.group_name;
    }
    return s;
  };

  // tslint:disable-next-line:max-func-body-length
  render() {
    const {
      match: { url: matchUrl },
    } = this.props;

    const { currentGroup: group } = this.context;

    if (!group) {
      return (
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Spin />
        </Flex>
      );
    }

    const features = groupFeatures[group.group_type];

    return (
      <LocaleContext.Consumer>
        {({ texts }) => (
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
              {features.hasTasks && (
                <MenuLink to={`${matchUrl}/tasks`} key="tasks">
                  <Icon type="calculator" />
                  {texts.tasks}
                </MenuLink>
              )}
              {features.hasTests && (
                <MenuLink to={`${matchUrl}/tests`} key="tests">
                  <Icon type="edit" />
                  {texts.tests}
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
                <Route exact path={'/groups/:id'}>
                  <SettingsSection {...this.context} />
                </Route>
                <Route exact path={'/groups/:id/students'}>
                  <StudentsSection {...this.context} />
                </Route>
                <Route exact path={'/groups/:id/presence'}>
                  <MeetingsDetailsSections {...this.context} />
                </Route>
                <Route exact path={'/groups/:id/meetings'}>
                  <MeetingsSection {...this.context} />
                </Route>
                <Route exact path={'/groups/:id/tasks'}>
                  <TasksSection {...this.context} />
                </Route>
                <Route exact path={'/groups/:id/tasks/new'}>
                  <TaskSection>
                    <NewTaskForm onSubmit={console.log} />
                  </TaskSection>
                </Route>
                <Route exact path={'/groups/:id/tests'}>
                  <TestsSection {...this.context} />
                </Route>
                <NotFoundPage />
              </Switch>
            </Flex>
          </Flex>
        )}
      </LocaleContext.Consumer>
    );
  }
}
