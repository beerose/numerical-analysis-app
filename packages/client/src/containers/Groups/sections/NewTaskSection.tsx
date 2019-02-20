import * as React from 'react';
import { Omit, RouteComponentProps } from 'react-router';

import { TaskDTO } from '../../../../../../dist/common';
import { Flex } from '../../../components';
import { Theme } from '../../../components/theme';
import { showMessage } from '../../../utils';
import { NewTaskForm } from '../components';
import { GroupApiContextState } from '../GroupApiContext';

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const NewTaskSection = ({ actions, history }: Props) => {
  const handleSubmit = (values: Omit<TaskDTO, 'id'>) => {
    actions.createTask(values).then(res => {
      showMessage(res);
      if ('error' in res) {
        return;
      }

      history.push(String(res.task_id));
    });
  };

  return (
    <Flex alignItems="center" padding={Theme.Padding.Half}>
      <NewTaskForm onSubmit={handleSubmit} />
    </Flex>
  );
};
