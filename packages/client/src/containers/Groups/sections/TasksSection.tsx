/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Card, List, Spin } from 'antd';
import { useEffect } from 'react';

import { TaskDTO, TaskKind } from '../../../../../../dist/common';
import { Theme } from '../../../components/theme';
import { DateRange } from '../../../components/DateRange';
import { DeleteWithConfirm } from '../../../components/DeleteWithConfirm';
import { Flex } from '../../../components/Flex';
import { Colors, LABELS, showMessage } from '../../../utils';
import { GroupApiContextState } from '../GroupApiContext';

const Container = styled.section`
  padding: ${Theme.Padding.Standard};
`;

const TaskTitle = ({ kind, name }: Pick<TaskDTO, 'kind' | 'name'>) => (
  <span>
    <b>{kind === TaskKind.Assignment ? 'Pracownia' : 'Zadanie domowe'}</b>:{' '}
    {name}
  </span>
);

const StyledTaskCard = styled(Card)`
  .ant-card-body {
    padding: 0 15px;
  }
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${Colors.SemiLightGrey};
    background: ${Colors.PrimaryLightGrey};
  }
`;

type Props = GroupApiContextState;
export const TasksSection = (props: Props) => {
  const { tasks } = props;

  useEffect(() => {
    if (!tasks) {
      props.actions.listTasks();
    }
  }, []);

  const deleteTask = (taskId: TaskDTO['id']) => {
    const { deleteTaskFromGroup, listTasks } = props.actions;
    deleteTaskFromGroup(taskId).then(res => {
      showMessage(res);
      listTasks();
    });
  };

  const onItemClick = (itemName: TaskDTO['name']) => {
    props.actions.goToTaskPage(itemName);
  };

  return (
    <Container>
      <Button
        icon="plus"
        type="primary"
        onClick={() => props.actions.goToNewTaskPage()}
      >
        Nowe zadanie
      </Button>
      {tasks ? (
        <List
          itemLayout="horizontal"
          dataSource={tasks}
          css={css`
            padding: ${Theme.Padding.Standard} 0;
            max-height: 100vh;
          `}
          renderItem={(task: TaskDTO) => {
            return (
              <StyledTaskCard onClick={() => onItemClick(task.name)}>
                <List.Item
                  actions={[
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
                    start={task.start_upload_date}
                    end={task.end_upload_date}
                  />
                </List.Item>
              </StyledTaskCard>
            );
          }}
        />
      ) : (
        <Flex justifyContent="center">
          <Spin spinning />
        </Flex>
      )}
    </Container>
  );
};
