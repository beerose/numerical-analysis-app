/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon, Menu, Spin } from 'antd';
import { GroupDTO, groupFeatures, UserWithGroups } from 'common';
import { Location } from 'history';
import React, { Fragment, useCallback, useContext, useEffect } from 'react';
import { Route, RouteComponentProps } from 'react-router';

import {
  Breadcrumbs,
  Flex,
  LocaleContext,
  PaddingContainer,
  theme,
} from '../../components';
import { isNumberOrNumberString } from '../../utils';

import { MenuLink } from './components/MenuLink';
import { StudentGroupInfoSection } from './sections/StudentGroupInfoSection';
import { StudentGroupMeetingsSection } from './sections/StudentGroupMeetingsSection';
import { StudentTaskDetailsSection } from './sections/StudentTaskDetailsSection';
import { GroupApiContext } from './GroupApiContext';

const StudentGroupDetailsMenu = ({
  group,
  location,
}: {
  group?: GroupDTO;
  location: Location;
}) => {
  const { texts } = useContext(LocaleContext);

  const features = group && groupFeatures[group.group_type];

  return (
    <Menu
      mode="inline"
      css={{ width: 250, flexShrink: 0 }}
      selectedKeys={[location.pathname.split('/')[3] || 'info']}
    >
      <MenuLink
        to={`/groups/${group && group.id}/`}
        key="info"
        disabled={!group}
      >
        <Icon type="home" />
        {texts.info}
      </MenuLink>
      {features && features.hasMeetings && (
        <MenuLink to={`/groups/${group!.id}/meetings`} key="meetings">
          <Icon type="schedule" />
          {texts.meetings}
        </MenuLink>
      )}
      {features && features.hasTasks && (
        <MenuLink to={`/groups/${group!.id}/tasks/:taskId`} key="tasks">
          <Icon type="calculator" />
          {texts.tasks}
        </MenuLink>
      )}
    </Menu>
  );
};

export type StudentGroupDetailsContainerProps = RouteComponentProps<{
  id: string;
}>;

export const StudentGroupDetailsContainer: React.FC<
  StudentGroupDetailsContainerProps
> = ({
  location,
  match: {
    params: { id: paramsGroupId },
  },
}) => {
  const {
    currentGroup,
    actions: { getGroup, cleanCurrentGroup },
  } = useContext(GroupApiContext);

  console.assert(paramsGroupId && isNumberOrNumberString(paramsGroupId));

  const groupId = Number(paramsGroupId);

  useEffect(() => {
    if (!currentGroup) {
      getGroup(groupId);
    } else if (currentGroup.id !== groupId) {
      cleanCurrentGroup();
    }
  }, [currentGroup]);

  const replaceGroupIdBreadcrumb = useCallback(
    (tokens: string[]) => {
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
    },
    [currentGroup]
  );

  return (
    <Flex flexDirection="row" flex={1}>
      <StudentGroupDetailsMenu group={currentGroup} location={location} />
      <PaddingContainer css={{ flex: 1 }}>
        <Breadcrumbs
          css={{ paddingBottom: theme.Padding.Half }}
          replaceTokens={replaceGroupIdBreadcrumb}
        />
        {currentGroup ? (
          <Fragment>
            <Route
              exact
              path="/groups/:groupId/"
              component={StudentGroupInfoSection}
            />
            <Route
              exact
              path="/groups/:groupId/meetings"
              component={StudentGroupMeetingsSection}
            />
            <Route
              exact
              path="/groups/:groupId/tasks/:taskId"
              component={StudentTaskDetailsSection}
            />
          </Fragment>
        ) : (
          <Flex center flex={1}>
            <Spin />
          </Flex>
        )}
      </PaddingContainer>
    </Flex>
  );
};
