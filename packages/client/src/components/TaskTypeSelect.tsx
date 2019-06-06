import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectProps, SelectValue } from 'antd/lib/select';
import { TaskKind } from 'common';
import React, { useContext } from 'react';

import { Colors } from '../utils';

import { LocaleContext } from './locale';

const taskTypeValues = Object.values(TaskKind).reverse();

type Props = {
  onChange?: (value: SelectValue) => void;
  value?: TaskKind;
} & SelectProps;

export const TaskTypeSelect = React.forwardRef(
  ({ onChange, value, ...props }: Props, ref: React.Ref<Select<TaskKind>>) => {
    const { getText } = useContext(LocaleContext);

    return (
      <Select<TaskKind>
        {...props}
        mode="single"
        placeholder={
          <>
            <Icon
              type="pushpin"
              style={{ color: Colors.SemiLightGray, marginRight: '5px' }}
            />
          </>
        }
        onChange={onChange}
        defaultValue={undefined}
        style={{ minWidth: '120px' }}
        value={value}
        ref={ref}
      >
        {taskTypeValues.map((kind: TaskKind) => (
          <Select.Option key={kind} value={kind}>
            {getText(kind)}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
