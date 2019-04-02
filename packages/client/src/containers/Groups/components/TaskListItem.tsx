/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Card, Input, List, Table, Spin } from 'antd';
import {
  TaskDTO,
  UserDTO,
  UserWithGroups,
  ApiResponse,
  Grade,
  Student,
} from 'common';
import { useState, ChangeEvent, useEffect } from 'react';

import { DateRange, DeleteWithConfirm, Flex } from '../../../components/';
import { Colors, LABELS, showMessage } from '../../../utils';

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

type TaskPointsInputProps = {
  task: TaskDTO;
  userId: UserDTO['id'];
  onChange: (
    taskId: TaskDTO['id'],
    userId: UserDTO['id'],
    points: number
  ) => void;
  grade?: Grade;
};

const TaskPointsInput = (props: TaskPointsInputProps) => {
  const { task, userId, onChange, grade } = props;

  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(task.id, userId, Number(event.target.value));
  };

  return (
    <Input
      css={css`
        width: ${task.max_points < 10
          ? '50px'
          : task.max_points < 100
          ? '55px'
          : '65px'};
        border: 1 solid ${Colors.SemiLightGrey} !important;
        margin-right: 3px;
      `}
      type="number"
      defaultValue={grade && grade.points.toString()}
      onChange={handleInputValueChange}
    />
  );
};

const makeStudentsTableRowKey = (item: UserWithGroups) => item.id.toString();

type Props = {
  navigateTo: (path: string) => void;
  task: TaskDTO;
  deleteTask: (taskId: TaskDTO['id']) => void;
  setTaskPoints: (
    taskId: TaskDTO['id'],
    userId: UserDTO['id'],
    points: number
  ) => Promise<ApiResponse>;
  students?: UserWithGroups[];
  fetchGrades: (taskId: TaskDTO['id']) => Promise<Grade[]>;
};

export const TaskListItem = ({
  navigateTo,
  task,
  deleteTask,
  students,
  setTaskPoints,
  fetchGrades,
}: Props) => {
  const [gradesVisible, setGradesVisible] = useState<boolean>(false);
  const [grades, setGrades] = useState<Grade[] | undefined>(undefined);

  useEffect(() => {
    if (!grades && gradesVisible) {
      fetchGrades(task.id).then(res => {
        const studentIds = students ? students.map(s => s.id) : [];
        setGrades(res.filter(grade => studentIds.includes(grade.user_id)));
      });
    }
  }, [gradesVisible, grades]);

  const handleSetTaskPoints = (
    taskId: TaskDTO['id'],
    userId: UserDTO['id'],
    points: number
  ) => {
    setTaskPoints(taskId, userId, points).then(res => {
      if ('error' in res) {
        showMessage(res);
      }
    });
  };

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
      render: (user: UserWithGroups) => (
        <Flex justifyContent="center" alignContent="center" alignItems="center">
          <TaskPointsInput
            onChange={handleSetTaskPoints}
            task={task}
            grade={
              grades &&
              grades.find(g => g.user_id === user.id && g.task_id === task.id)
            }
            userId={user.id}
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
      {gradesVisible &&
        (grades ? (
          <Table
            rowKey={makeStudentsTableRowKey}
            dataSource={students}
            pagination={false}
            columns={columns}
            size="small"
          />
        ) : (
          <Flex justifyContent="center" alignItems="center">
            <Spin />
          </Flex>
        ))}
    </StyledTaskCard>
  );
};
