/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { List } from 'antd';
import { GroupDTO } from 'common';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { getStudentGroups } from '../../api/userApi';
import { PaddingContainer } from '../../components';
import { usePromise } from '../../utils';
import { AuthStoreState } from '../../AuthStore';
import { GroupsListItemDescription } from '../Groups/components/GroupsListItemDescription';
import { GroupApiContext } from '../Groups/GroupApiContext';

type MyGroupsListItemProps = { group: GroupDTO };
const MyGroupsListItem: React.FC<MyGroupsListItemProps> = ({ group }) => {
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

export type StudentHomeProps = AuthStoreState;
export const StudentHome: React.FC<StudentHomeProps> = (
  props: AuthStoreState
) => {
  const {
    actions: { getGroupsForStudent },
  } = useContext(GroupApiContext);

  const result = usePromise(
    () =>
      getGroupsForStudent(props.user!.id!).catch((error: Error) => ({ error })),
    [] as GroupDTO[],
    [props.user!.id]
  );

  if ('error' in result && result.error) {
    throw result.error;
  }

  const groups = result as GroupDTO[];

  return (
    <PaddingContainer>
      <section>
        <h1
          css={css`
            font-size: 2em;
          `}
        >
          Twoje grupy
        </h1>
        <List
          dataSource={groups}
          renderItem={group => <MyGroupsListItem group={group} />}
        />
      </section>
    </PaddingContainer>
  );
};

export default StudentHome;
