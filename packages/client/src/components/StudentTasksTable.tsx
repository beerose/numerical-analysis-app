/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Spin, Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import Text from 'antd/lib/typography/Text';
import { GroupDTO, StudentTasksSummary, TaskDTO } from 'common';
import { formatRelative } from 'date-fns';
// Import en if needed.
import { pl } from 'date-fns/locale';
import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ApiResponse2 } from '../api/authFetch';
import { GroupApiContext } from '../pages/Groups/GroupApiContext';
import { identity, usePromise } from '../utils';
import { makeTableSorter } from '../utils/makeTableSorter';
import { useAuthStore } from '../AuthStore';

import { LocaleContext } from './locale';
import { Flex } from './Flex';

function renderDate(s: string) {
  const now = new Date();
  return formatRelative(new Date(s), now, { locale: pl });
}

type TaskSummary = StudentTasksSummary[number];

const columnIndexes: Array<keyof TaskSummary> = [
  'name',
  'kind',
  'pts',
  'max_pts',
  'start_upload_date',
  'end_upload_date',
  'updated_at',
  'created_at',
];

const NAME_INDEX = columnIndexes.indexOf('name');
const KIND_INDEX = columnIndexes.indexOf('kind');

// tslint:disable: object-literal-sort-keys
const columnTitles = {
  id: '',
  data: '',
  kind: 'taskKind',
  name: 'taskName',
  pts: 'points',
  max_pts: 'max',
  start_upload_date: 'startUploadDate',
  end_upload_date: 'endUploadDate',
  updated_at: 'updatedAt',
  created_at: 'createdAt',
};

const rowKey = (record: { id: number | string }) => String(record.id);

export type StudentTasksTableProps = TableProps<TaskSummary> & {
  groupId?: GroupDTO['id'];
};

export const StudentTasksTable: React.FC<StudentTasksTableProps> = ({
  groupId,
  ...rest
}) => {
  const {
    actions: { getStudentTasksSummary },
  } = useContext(GroupApiContext);
  const userId = useAuthStore(s => (s.user && s.user.id)!);
  const { getText } = useContext(LocaleContext);

  console.assert(userId !== undefined);

  const columns = useMemo(() => {
    const mappedIndexes = columnIndexes.map(s => ({
      dataIndex: s,
      key: s,
      sorter: makeTableSorter(s),
      title: getText(columnTitles[s]),
      render: s.match(/_date|_at/) ? renderDate : identity,
    }));

    Object.assign(mappedIndexes[NAME_INDEX], {
      render(taskName: string, task: TaskDTO) {
        return (
          <Link
            css={{ fontWeight: 'bold' }}
            to={{
              pathname: `/groups/${groupId}/tasks/${task.id}`,
              state: { task },
            }}
          >
            {taskName}
          </Link>
        );
      },
    });
    Object.assign(mappedIndexes[KIND_INDEX], { render: getText });

    return mappedIndexes;
  }, [getText]);

  const tasksSummary = usePromise(
    () => getStudentTasksSummary(userId, groupId),
    'LOADING',
    []
  );

  if (tasksSummary === 'LOADING') {
    return (
      <Flex
        width="100%"
        height="300px"
        justifyContent="center"
        alignItems="center"
      >
        <Spin />
      </Flex>
    );
  }

  if (ApiResponse2.isError(tasksSummary) || 'message' in tasksSummary) {
    return <Text>{ApiResponse2.Error.toString(tasksSummary)}</Text>;
  }

  return (
    <Table<TaskSummary>
      dataSource={tasksSummary}
      rowKey={rowKey}
      columns={columns}
      css={css`
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
        &:hover {
          box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.1);
        }

        transition: box-shadow 250ms linear;

        .ant-pagination {
          margin-right: 1em;
        }

        .ant-table-body {
          overflow-x: auto;
        }
      `}
      {...rest}
    />
  );
};
