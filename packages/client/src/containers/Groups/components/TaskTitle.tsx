import { TaskDTO } from 'common';
import React, { useContext } from 'react';

import { LocaleContext } from '../../../components/locale';

export const TaskTitle = ({ kind, name }: Pick<TaskDTO, 'kind' | 'name'>) => {
  const { getText } = useContext(LocaleContext);
  return (
    <span>
      <b>{getText(kind)}</b>: {name}
    </span>
  );
};
