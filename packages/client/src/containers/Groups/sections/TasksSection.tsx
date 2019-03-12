/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Card, List, Spin } from 'antd';
import { join } from 'path';
import { useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { TaskDTO } from '../../../../../../dist/common';
import { Theme } from '../../../components/theme';
import { Flex } from '../../../components/Flex';
import { showMessage } from '../../../utils';
import { TaskListItem } from '../components/TaskListItem';
import { GroupApiContextState } from '../GroupApiContext';

const Container = styled.section`
  padding: ${Theme.Padding.Standard};
`;

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const TasksSection = ({ actions, tasks, history }: Props) => {
  useEffect(() => {
    if (!tasks) {
      actions.listTasks();
    }
  }, [actions]);

  const deleteTask = useCallback(
    (taskId: TaskDTO['id']) => {
      const { deleteTaskFromGroup, listTasks } = actions;
      deleteTaskFromGroup(taskId).then(res => {
        showMessage(res);
        listTasks();
      });
    },
    [actions]
  );

  const navigateTo = useCallback(
    (path: string) => {
      history.push(join(location.pathname, path));
    },
    [location.pathname]
  );

  return (
    <Container>
      <Button icon="plus" type="primary" onClick={() => navigateTo('new')}>
        Nowe zadanie
      </Button>
      {tasks ? (
        <List
          itemLayout="horizontal"
          dataSource={tasks}
          css={css`
            padding-top: ${Theme.Padding.Standard};
            height: 100%;
          `}
          renderItem={(task: TaskDTO) => (
            <TaskListItem
              navigateTo={navigateTo}
              task={task}
              deleteTask={deleteTask}
            />
          )}
        />
      ) : (
        <Flex justifyContent="center">
          <Spin spinning />
        </Flex>
      )}
    </Container>
  );
};
