/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Input, List, Modal, Select, Spin } from 'antd';
import { join } from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { TaskDTO } from '../../../../../../dist/common';
import { Flex } from '../../../components/Flex';
import { Theme } from '../../../components/Theme';
import { findStringifiedLowercase, LABELS, showMessage } from '../../../utils';
import { TaskListItem } from '../components/TaskListItem';
import { GroupApiContextState } from '../GroupApiContext';

const Container = styled.section`
  padding: ${Theme.Padding.Standard};
`;

type Props = GroupApiContextState &
  Pick<RouteComponentProps, 'history'> & {
    editable: boolean;
  };
export const TasksSection = ({
  actions,
  history,
  currentGroupStudents,
  editable,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [allTasks, setAllTasks] = useState<TaskDTO[]>([]);
  const [selectedTask, setSelectedTask] = useState<{
    id?: TaskDTO['id'];
    weight?: number;
  }>({});

  useEffect(() => {
    if (!tasks.length) {
      actions.listTasks({ all: false }).then(res => setTasks(res.tasks));
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
        listTasks({ all: false }).then(listRes => setTasks(listRes.tasks));
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

  const handleOpenModal = () => {
    const groupTasksIds = tasks.map(t => t.id);
    setModalVisible(true);
    if (!allTasks.length) {
      actions
        .listTasks({ all: true })
        .then(res =>
          setAllTasks(res.tasks.filter(t => !groupTasksIds.includes(t.id)))
        );
    }
  };

  const handleAttachTask = () => {
    actions.attachTask(selectedTask!.id!, selectedTask!.weight!).then(res => {
      setModalVisible(false);
      showMessage(res);
      actions
        .listTasks({ all: false })
        .then(listRes => setTasks(listRes.tasks));
    });
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist();
      setSelectedTask(prev => ({
        id: prev.id,
        weight: Number(event.target.value),
      }));
    },
    []
  );

  return (
    <Container>
      {editable && (
        <div>
          <Button icon="plus" type="primary" onClick={() => navigateTo('new')}>
            Nowe zadanie
          </Button>
          <Button
            icon="plus"
            type="primary"
            onClick={handleOpenModal}
            style={{ marginLeft: 20 }}
          >
            Dodaj istniejące zadanie
          </Button>
          <Modal
            footer={null}
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            cancelText="Cofnij"
            onOk={handleAttachTask}
            okText={LABELS.save}
          >
            <Select
              showSearch
              filterOption={findStringifiedLowercase}
              style={{
                margin: `${Theme.Padding.Half} 0 0 ${Theme.Padding.Half}`,
                width: 400,
              }}
              onChange={(value: number) =>
                setSelectedTask(prev => ({ weight: prev.weight, id: value }))
              }
              placeholder="Wybierz zadanie"
            >
              {allTasks.map(task => (
                <Select.Option key={task.id.toString()} value={task.id}>
                  {task.name}
                </Select.Option>
              ))}
            </Select>

            <Input
              style={{ width: 400, margin: Theme.Padding.Half }}
              type="number"
              placeholder="Podaj wagę zadania"
              onChange={handleInputChange}
            />
            <Button
              style={{ marginLeft: Theme.Padding.Half }}
              type="primary"
              onClick={handleAttachTask}
              disabled={!selectedTask.weight || !selectedTask.id}
            >
              Zapisz
            </Button>
          </Modal>
        </div>
      )}
      {tasks ? (
        <List
          itemLayout="horizontal"
          dataSource={tasks}
          css={css`
            padding-top: ${Theme.Padding.Half};
            height: 100%;
          `}
          renderItem={(task: TaskDTO) => (
            <TaskListItem
              editable={!editable}
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
