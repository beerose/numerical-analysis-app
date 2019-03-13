/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Card, Input, List, Table } from 'antd';
import { TaskDTO, UserDTO } from 'common';
import { useState } from 'react';

import { DateRange, DeleteWithConfirm, Flex } from '../../../components/';
import { Colors, LABELS } from '../../../utils';

import { TaskTitle } from './TaskTitle';

const StyledTaskCard = styled(Card)`
  .ant-card-body {
    padding: 0 15px;
    * {
      padding-top: 2px;
      padding-bottom: 0;
    }
  }
  .ant-list-item {
    cursor: pointer;
  }
  .ant-table,
  .ant-table-content {
    border: none !important;
    padding-bottom: 10px;
  }
  margin-bottom: 10px;
  &:hover {
    border: 1px solid ${Colors.SemiLightGrey};
  }
`;

type Props = {
  navigateTo: (path: string) => void;
  task: TaskDTO;
  deleteTask: (taskId: number) => void;
  students?: UserDTO[];
};

export const TaskListItem = ({
  navigateTo,
  task,
  deleteTask,
  students,
}: Props) => {
  const [gradesVisible, setGradesVisible] = useState<boolean>(false);

  const columns = [
    {
      fixed: true,
      key: 'user_name',
      render: (user: UserDTO) => (
        <p>
          {user.user_name} ({user.student_index})
        </p>
      ),
      sorter: (a: UserDTO, b: UserDTO) => Number(a.user_name < b.user_name),
      title: 'Student',
      width: '100',
    },
    {
      fixed: true,
      key: 'points',
      render: () => (
        <Flex justifyContent="center" alignContent="center" alignItems="center">
          <Input
            css={css`
              width: 35px;
              border: 1 solid ${Colors.SemiLightGrey} !important;
              margin-right: 3px;
            `}
          />{' '}
          / {task.max_points}
        </Flex>
      ),
      title: 'Punkty',
    },
  ];

  return (
    <StyledTaskCard>
      <List.Item
        actions={[
          <a role="button" onClick={() => navigateTo(String(task.id))}>
            {LABELS.edit}
          </a>,
          <DeleteWithConfirm
            onConfirm={() => {
              deleteTask(task.id);
            }}
          >
            <a>{LABELS.delete}</a>
          </DeleteWithConfirm>,
        ]}
        onClick={() => setGradesVisible(!gradesVisible)}
      >
        <List.Item.Meta
          title={<TaskTitle kind={task.kind} name={task.name} />}
          description={task.description}
        />
        <DateRange
          start={task.start_upload_date as string}
          end={task.end_upload_date as string}
        />
      </List.Item>
      {gradesVisible && (
        <Table
          bordered
          dataSource={students}
          pagination={false}
          columns={columns}
          size="small"
        />
      )}
    </StyledTaskCard>
  );
};
