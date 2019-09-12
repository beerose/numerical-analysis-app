import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectProps, SelectValue } from 'antd/lib/select';
import { GroupType, TaskKind } from 'common';
import React, { useContext } from 'react';

import { Colors, findStringifiedLowercase } from '../utils';

import { LocaleContext } from './locale';

const taskTypeValues = Object.values(TaskKind).reverse();

type Props = {
  onChange?: (value: SelectValue) => void;
  value?: TaskKind;
  groupType: GroupType;
} & SelectProps;

export const TaskKindSelect = React.forwardRef(
  (
    { onChange, value, groupType, ...props }: Props,
    ref: React.Ref<Select<TaskKind>>
  ) => {
    const { getText } = useContext(LocaleContext);

    const options = {
      lab: [TaskKind.Assignment, TaskKind.Homework, TaskKind.Test],
      exercise: [TaskKind.Homework, TaskKind.Test],
      lecture: [TaskKind.Exam, TaskKind.Test, TaskKind.Retake],
    };

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
        showSearch
        defaultValue={undefined}
        filterOption={findStringifiedLowercase}
        style={{ minWidth: '120px' }}
        value={value}
        ref={ref}
      >
        {options[groupType].map((kind: TaskKind) => (
          <Select.Option key={kind} value={kind}>
            {getText(kind)}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
