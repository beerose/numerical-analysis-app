/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, List, Spin, Modal } from 'antd';
import { join } from 'path';
import { useCallback, useEffect, useState } from 'react';
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
export const TasksSection = ({
  actions,
  tasks,
  history,
  currentGroupStudents,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!tasks) {
      actions.listTasks();
    }
    if (!currentGroupStudents) {
      actions.listStudentsWithGroup();
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
      <Button
        icon="plus"
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ marginLeft: 20 }}
      >
        Dodaj istniejące zadanie
      </Button>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} />
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
              students={currentGroupStudents}
              setTaskPoints={actions.setTaskPoints}
              fetchGrades={actions.getGrades}
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
