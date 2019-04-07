import { List } from 'antd';
import { TaskDTO } from 'common';
import React, { useContext } from 'react';

import { LocaleContext } from '../../../components/locale';

type TaskMetaProps = {
  task: Pick<TaskDTO, 'kind' | 'name' | 'description'>;
};

export const TaskMeta: React.FC<TaskMetaProps> = ({ task }) => {
  const { getText } = useContext(LocaleContext);
  return (
    <List.Item.Meta
      title={
        <span>
          <b>{getText(task.kind)}</b>: {task.name}
        </span>
      }
      description={task.description}
    />
  );
};
