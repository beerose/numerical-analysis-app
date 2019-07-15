/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { List } from 'antd';
import { GroupDTO, UserDTO } from 'common';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { GroupsListItemDescription } from '../pages/Groups/components/GroupsListItemDescription';
import { GroupApiContext } from '../pages/Groups/GroupApiContext';
import { usePromise } from '../utils';

import { Heading } from '.';
import { LocaleContext } from './locale';

type StudentGroupsListItemProps = { group: GroupDTO };
const StudentGroupsListItem: React.FC<StudentGroupsListItemProps> = ({
  group,
}) => {
  return (
    <List.Item
      css={css`
        flex-wrap: wrap;
      `}
    >
      <h1
        css={css`
          width: 100%;
          & > a {
            color: inherit;
            :hover {
              text-decoration: underline;
            }
          }
        `}
      >
        <Link to={`/groups/${group.id}`}>{group.group_name}</Link>
      </h1>
      <GroupsListItemDescription
        lecturerId={group.lecturer_id}
        lecturerName={group.lecturer_name!}
        group={group}
      />
    </List.Item>
  );
};

type StudentGroupsListProps = {
  user: UserDTO;
};
export const StudentGroupsList: React.FC<StudentGroupsListProps> = ({
  user,
}) => {
  const {
    groups: cachedGroups,
    actions: { getGroupsForStudent },
  } = useContext(GroupApiContext);
  const { texts } = useContext(LocaleContext);

  const groups = usePromise(
    async () =>
      cachedGroups ||
      getGroupsForStudent(user!.id!).catch((error: Error) => ({ error })),
    'LOADING',
    [user!.id]
  );

  if (typeof groups === 'object' && 'error' in groups && groups.error) {
    throw groups.error;
  }

  return (
    <section>
      <Heading>{texts.yourGroups}</Heading>
      <List
        loading={groups === 'LOADING'}
        dataSource={Array.isArray(groups) ? groups : []}
        renderItem={group => <StudentGroupsListItem group={group} />}
      />
    </section>
  );
};
