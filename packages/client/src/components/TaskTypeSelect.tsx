import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import { TaskDTO, TaskKind } from 'common';
import React, { useContext } from 'react';

import { Colors } from '../utils';

import { LocaleContext } from './locale';

const taskTypeValues = Object.values(TaskKind).reverse();

type Props = {
  onChange?: (value: SelectValue) => void;
  initialValue?: TaskDTO['kind'];
};

export const TaskTypeSelect = React.forwardRef(
  ({ onChange, initialValue }: Props, ref: React.Ref<Select>) => {
    const { getText } = useContext(LocaleContext);

    return (
      <Select
        mode="single"
        placeholder={
          <>
            <Icon
              type="pushpin"
              style={{ color: Colors.SemiLightGrey, marginRight: '5px' }}
            />
          </>
        }
        onChange={onChange}
        style={{ minWidth: '120px' }}
        value={initialValue}
        ref={ref}
      >
        {taskTypeValues.map((value: TaskKind) => (
          <Select.Option key={value} value={value}>
            {getText(value)}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
