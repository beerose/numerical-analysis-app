import { Spin } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { TaskDTO } from '../../../../../../dist/common';
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
  }, []);

  const handleSubmit = (values: TaskDTO) => {
    console.log(props.mode);
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

  if (props.isLoading) {
    return <Spin />;
  }

  return (
    <Flex alignItems="center" padding={Theme.Padding.Half}>
      {props.mode === 'create' ? (
        <TaskForm onSubmit={handleSubmit} mode="create" />
      ) : (
        <TaskForm
          onSubmit={handleSubmit}
          mode="edit"
          model={props.currentTask}
        />
      )}
    </Flex>
  );
};
