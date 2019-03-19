/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Card, Input, List, Table } from 'antd';
import { TaskDTO, UserDTO, UserWithGroups } from 'common';
import { useState, ChangeEvent } from 'react';

import { DateRange, DeleteWithConfirm, Flex } from '../../../components/';
import { Colors, LABELS } from '../../../utils';

import { TaskTitle } from './TaskTitle';
import { ProgressPlugin } from 'webpack';

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

type TaskPointsInputProps = {
  taskId: TaskDTO['id'];
  userId: UserDTO['id'];
  onChange: (
    taskId: TaskDTO['id'],
    userId: UserDTO['id'],
    points: number
  ) => void;
};

const TaskPointsInput = (props: TaskPointsInputProps) => {
  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { taskId, userId, onChange } = props;

    onChange(
      taskId,
      userId,
      Number(event.target.value) ? Number(event.target.value) : 0
    );
  };

  return (
    <Input
      css={css`
        width: 35px;
        border: 1 solid ${Colors.SemiLightGrey} !important;
        margin-right: 3px;
      `}
      onChange={handleInputValueChange}
    />
  );
};

type Props = {
  navigateTo: (path: string) => void;
  task: TaskDTO;
  deleteTask: (taskId: TaskDTO['id']) => void;
  setGrade: (
    taskId: TaskDTO['id'],
    userId: UserDTO['id'],
    points: number
  ) => void;
  students?: UserWithGroups[];
};

export const TaskListItem = ({
  navigateTo,
  task,
  deleteTask,
  students,
  setGrade,
}: Props) => {
  const [gradesVisible, setGradesVisible] = useState<boolean>(false);

  const columns = [
    {
      fixed: true,
      key: 'user_name',
      render: (user: UserWithGroups) => (
        <p>
          {user.user_name} ({user.student_index})
        </p>
      ),
      sorter: (a: UserWithGroups, b: UserWithGroups) =>
        Number(a.user_name < b.user_name),
      title: 'Student',
      width: '100',
    },
    {
      fixed: true,
      key: 'points',
      render: (user: UserWithGroups) => {
        return (
          <Flex
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <TaskPointsInput
              onChange={setGrade}
              taskId={task.id}
              userId={user.id}
            />{' '}
            / {task.max_points}
          </Flex>
        );
      },
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
