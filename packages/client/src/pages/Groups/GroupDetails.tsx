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
import { Flex } from '../../components/Flex';
import { Theme } from '../../components/Theme';
import { isUserPrivileged } from '../../utils/isUserPrivileged';
import { useAuthStore } from '../../AuthStore';

import { ShareGroupForEdit } from './components';
import {
  AttachedGroupsSection,
  GradesSection,
  MeetingsDetailsSections,
  MeetingsSection,
  SettingsSection,
  StudentsSection,
  TaskSection,
  TasksSection,
} from './sections';
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
  width: 250px;
`;

type State = {
  editable: boolean;
};

export const GroupDetailsContainer = (props: RouteComponentProps) => {
  const context = useContext(GroupApiContext);

  const [editable, setEditable] = useState(false);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const groupId = Number(props.location.pathname.split('/')[2]);

    if (!context.currentGroup || context.currentGroup.id !== groupId) {
      context.actions.getGroup().then(res => {
        setEditable(isUserPrivileged(['edit'], 'groups', res.id, user));
      });
    }
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

      // TO DO
      // if (previousToken === 'tasks' && currentTask && Number(token)) {
      //   return currentTask.name;
      // }

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
            {features.hasTasks && (
              <MenuLink to={`${matchUrl}/tasks`} key="tasks">
                <Icon type="calculator" />
                {texts.tasks}
              </MenuLink>
            )}
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
            <Menu.Item>
              <ShareGroupForEdit
                currentGroup={context.currentGroup}
                lecturers={context.lecturers}
                actions={context.actions}
              />
            </Menu.Item>
          </Menu>
          <Flex flexDirection="column" width="100%" overflow="hidden">
            <Breadcrumbs
              css={css`
                padding: ${Theme.Padding.Half} 0 0 ${Theme.Padding.Standard};
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
                <MeetingsDetailsSections {...context} />
              </Route>
              <Route exact path={'/groups/:id/meetings'}>
                <MeetingsSection {...context} />
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
                {({ history }) => (
                  <TaskSection {...context} history={history} mode={'create'} />
                )}
              </Route>
              <Route exact path={'/groups/:id/tasks/:task_id'}>
                {({ history }) => (
                  <TaskSection {...context} mode={'edit'} history={history} />
                )}
              </Route>
              <Route exact path={'/groups/:id/grades'}>
                {({ history }) => (
                  <GradesSection {...context} history={history} />
                )}
              </Route>
              <Route exact path={'/groups/:id/attached'}>
                {({ history }) => (
                  <AttachedGroupsSection {...context} history={history} />
                )}
              </Route>
              <NotFoundPage />
            </Switch>
          </Flex>
        </Flex>
      )}
    </LocaleContext.Consumer>
  );
};
