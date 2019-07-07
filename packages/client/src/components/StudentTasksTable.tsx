/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Spin, Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import Text from 'antd/lib/typography/Text';
import { GroupDTO, StudentTasksSummary } from 'common';
import { useContext } from 'react';

import { ApiResponse2 } from '../api/authFetch';
import { GroupApiContext } from '../pages/Groups/GroupApiContext';
import { usePromise } from '../utils';
import { useAuthStore } from '../AuthStore';

type TaskSummary = StudentTasksSummary[number];

export type StudentTasksListProps = TableProps<TaskSummary> & {
  groupId: GroupDTO['id'];
};

const StudentTasksList: React.FC<StudentTasksListProps> = ({
  groupId,
  ...rest
}) => {
  const {
    actions: { getStudentTasksSummary },
  } = useContext(GroupApiContext);
  const userId = useAuthStore(s => (s.user && s.user.id)!);

  console.assert(userId !== undefined);

  const tasksSummary = usePromise(
    () => getStudentTasksSummary(userId, groupId),
    'LOADING',
    []
  );

  if (tasksSummary === 'LOADING') {
    return <Spin />;
  }

  if (ApiResponse2.isError(tasksSummary) || 'message' in tasksSummary) {
    return <Text>{ApiResponse2.Error.toString(tasksSummary)}</Text>;
  }

  return (
    <Table<TaskSummary>
      dataSource={tasksSummary}
      // columns ?
      {...rest}
    />
  );
};

export default StudentTasksList;
