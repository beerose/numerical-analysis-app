import { List } from 'antd';
import { GroupDTO } from 'common';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { getStudentGroups } from '../../api/userApi';
import { PaddingContainer } from '../../components';
import { usePromise } from '../../utils';
import { AuthStoreState } from '../../AuthStore';
import { GroupsListItemDescription } from '../Groups/components/GroupsListItemDescription';

type MyGroupsListItemProps = { group: GroupDTO };
const MyGroupsListItem: React.FC<MyGroupsListItemProps> = ({ group }) => {
  return (
    <List.Item>
      <List.Item.Meta
        title={<Link to={`/groups/${group.id}`}>{group.group_name}</Link>}
        description={
          <GroupsListItemDescription
            lecturerId={group.lecturer_id}
            lecturerName={group.lecturer_name || '??????'}
            group={group}
          />
        }
      />
      {JSON.stringify(group)}
    </List.Item>
  );
};

export type StudentHomeProps = AuthStoreState;
export const StudentHome: React.FC<StudentHomeProps> = (
  props: AuthStoreState
) => {
  const result = usePromise(
    () => getStudentGroups(props.user!.id),
    { error: null },
    [props.user!.id]
  );

  if ('error' in result) {
    throw result.error;
  }

  const { groups } = result;

  return (
    <PaddingContainer>
      {JSON.stringify(props)}}
      <section>
        <h1>Moje grupy</h1>
        <List
          dataSource={groups}
          renderItem={group => <MyGroupsListItem group={group} />}
        />
      </section>
    </PaddingContainer>
  );
};

export default StudentHome;
