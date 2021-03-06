// tslint:disable-next-line:no-single-line-block-comment
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Menu, Spin } from 'antd';
import { groupFeatures } from 'common';
import { useContext, useEffect, useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';

import { Breadcrumbs, NotFoundPage } from '../../components';
import { LocaleContext } from '../../components/locale';
import { theme } from '../../components/theme';
import { Flex } from '../../components/Flex';
import { isUserPrivileged } from '../../utils/isUserPrivileged';
import { useAuthStore } from '../../AuthStore';

import { MenuLink } from './components/MenuLink';
import {
  AttachedGroupsSection,
  GradesSection,
  MeetingsDetailsSection,
  MeetingsSection,
  SettingsSection,
  StudentsSection,
  TaskSection,
  TasksSection,
} from './sections';
import { PrivilegesSection } from './sections/PrivilegesSection';
import { GroupApiContext } from './GroupApiContext';

const menuStyles = css`
  width: 250px;
`;

export const GroupDetailsContainer = (props: RouteComponentProps) => {
  const context = useContext(GroupApiContext);

  const [editable, setEditable] = useState(false);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const groupId = Number(props.location.pathname.split('/')[2]);

    if (!context.currentGroup || context.currentGroup.id !== groupId) {
      context.actions.getGroup();
    }

    setEditable(isUserPrivileged(['edit'], 'groups', groupId, user));
  }, [context.currentGroup, editable]);

  const getSelectedItem = () => {
    return props.location.pathname.split('/')[3] || 'settings';
  };

  const replaceGroupIdBreadcrumb = (tokens: string[]) => {
    const { currentGroup } = context;
    return tokens.map((token, i) => {
      const previousToken = tokens[i - 1];
      if (
        previousToken === 'groups' &&
        currentGroup &&
        Number(token) === currentGroup.id
      ) {
        return currentGroup.group_name;
      }
      
      return token;
    });
  };

  const {
    match: { url: matchUrl },
  } = props;

  const { currentGroup: group } = context;

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
            selectedKeys={[getSelectedItem()]}
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
            <MenuLink to={`${matchUrl}/tasks`} key="tasks">
              <Icon type="calculator" />
              {texts.tasks}
            </MenuLink>
            {features.hasAttachedGroups && (
              <MenuLink to={`${matchUrl}/attached`} key="attached">
                <Icon type="pushpin" />
                {texts.attached}
              </MenuLink>
            )}
            <MenuLink to={`${matchUrl}/grades`} key="grades">
              <Icon type="line-chart" />
              {texts.grades}
            </MenuLink>
            <MenuLink to={`${matchUrl}/privileges`} key="privileges">
              <Icon type="edit" />
              {texts.privileges}
            </MenuLink>
          </Menu>
          <Flex flexDirection="column" width="100%" overflow="hidden">
            <Breadcrumbs
              css={css`
                padding: ${theme.Padding.Half} 0 0 ${theme.Padding.Standard};
              `}
              replaceTokens={replaceGroupIdBreadcrumb}
            />
            <Switch>
              <Route exact path={'/groups/:id'}>
                <SettingsSection {...context} editable={editable} />
              </Route>
              <Route exact path={'/groups/:id/students'}>
                <StudentsSection {...context} editable={editable} />
              </Route>
              <Route exact path={'/groups/:id/presence'}>
                <MeetingsDetailsSection {...context} editable={editable} />
              </Route>
              <Route exact path={'/groups/:id/meetings'}>
                <MeetingsSection {...context} editable={editable} />
              </Route>
              <Route exact path={'/groups/:id/tasks'}>
                {({ history }) => (
                  <TasksSection
                    {...context}
                    history={history}
                    editable={editable}
                  />
                )}
              </Route>
              <Route exact path={'/groups/:id/tasks/new'}>
                {routerProps => (
                  <TaskSection {...context} {...routerProps} mode={'create'} />
                )}
              </Route>
              <Route exact path={'/groups/:id/tasks/:task_id'}>
                {routerProps => (
                  <TaskSection {...context} {...routerProps} mode={'edit'} />
                )}
              </Route>
              <Route exact path={'/groups/:id/grades'}>
                {routerProps => (
                  <GradesSection
                    {...context}
                    {...routerProps}
                    editable={editable}
                  />
                )}
              </Route>
              <Route exact path={'/groups/:id/attached'}>
                {routerProps => (
                  <AttachedGroupsSection
                    {...context}
                    {...routerProps}
                    editable={editable}
                  />
                )}
              </Route>
              <Route exact path={'/groups/:id/privileges'}>
                <PrivilegesSection {...context} editable={editable} />
              </Route>
              <NotFoundPage />
            </Switch>
          </Flex>
        </Flex>
      )}
    </LocaleContext.Consumer>
  );
};
