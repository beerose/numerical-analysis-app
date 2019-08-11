import { Spin } from 'antd';
import { TaskDTO } from 'common';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { ApiResponse2 } from '../../../api/authFetch';
import { Flex } from '../../../components';
import { theme } from '../../../components/theme';
import { showMessage } from '../../../utils';
import { WrappedTaskForm as TaskForm } from '../components/TaskForm';
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
  }, [props.mode]);

  const handleSubmit = (values: TaskDTO) => {
    props.mode === 'edit'
      ? props.actions.updateTask(values).then(res => {
          showMessage(res);
          props.actions.getTask();
        })
      : props.actions.createTask(values).then(res => {
          showMessage(res);
          if (ApiResponse2.isError(res)) {
            console.error('Error:', res);
            return;
          }

          navigateTo(String(res.data.task_id));
        });
  };

  if (props.isLoading) {
    return <Spin />;
  }

  return (
    <Flex
      alignItems="flex-start"
      padding={theme.Padding.Half}
      flexDirection="column"
    >
      <TaskForm
        onSubmit={handleSubmit}
        mode={props.mode}
        model={props.currentTask}
      />
    </Flex>
  );
};
