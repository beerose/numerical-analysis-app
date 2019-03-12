import styled from '@emotion/styled';
import { Card, List, Table } from 'antd';
import { TaskDTO } from 'common';
import React, { useState } from 'react';

import { DateRange, DeleteWithConfirm } from '../../../components/';
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
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${Colors.SemiLightGrey};
  }
`;

type Props = {
  navigateTo: (path: string) => void;
  task: TaskDTO;
  deleteTask: (taskId: number) => void;
};

export const TaskListItem = ({ navigateTo, task, deleteTask }: Props) => {
  const [gradesVisible, setGradesVisible] = useState<boolean>(false);

  return (
    <StyledTaskCard onClick={() => setGradesVisible(!gradesVisible)}>
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
      {gradesVisible && <Table />}
    </StyledTaskCard>
  );
};
