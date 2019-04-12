import { Spin, Button, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { TaskDTO } from 'common';
import { Flex } from '../../../components';
import { Theme } from '../../../components/theme';
import { showMessage } from '../../../utils';
import { TaskForm } from '../components';
import { GroupApiContextState } from '../GroupApiContext';

type Props = GroupApiContextState &
  Pick<RouteComponentProps, 'history'> & {
    mode: 'edit' | 'create';
  };
export const TaskSection = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const navigateTo = useCallback(
    (path: string) =>
      props.history.push(
        (location.pathname.endsWith('/new') ? '' : 'tasks/') + String(path)
      ),
    [location.pathname]
  );

  useEffect(() => {
    if (props.mode === 'edit') {
      props.actions.getTask();
    }
  }, [props.mode]);

  const handleSubmit = (values: TaskDTO) => {
    props.mode === 'edit'
      ? props.actions.updateTask(values).then(res => {
          showMessage(res);
          props.actions.getTask();
        })
      : props.actions.createTask(values).then(res => {
          showMessage(res);
          if ('error' in res) {
            return;
          }

          navigateTo(String(res.task_id));
        });
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    // TO DO: fetch ALL tasks - requires backend
  };

  const handleAddExistingTask = () => {
    // ..actions.attachTaskToGroup...
  };

  if (props.isLoading) {
    return <Spin />;
  }

  return (
    <Flex
      alignItems="flex-start"
      padding={Theme.Padding.Half}
      flexDirection="column"
    >
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        cancelText="Anuluj"
        okText="Dodaj zadanie"
      />
      <TaskForm
        onSubmit={handleSubmit}
        mode={props.mode}
        model={props.currentTask}
      />
    </Flex>
  );
};
