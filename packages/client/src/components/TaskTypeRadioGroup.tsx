import { Radio } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import RadioGroup from 'antd/lib/radio/group';
import { TaskKind } from 'common';
import React from 'react';

import { LABELS } from '../utils';

const taskTypeValues = Object.values(TaskKind).reverse();

export const TaskTypeRadioGroup = React.forwardRef<RadioGroup>((props, ref) => (
  <Radio.Group buttonStyle="solid" {...props} ref={ref}>
    {taskTypeValues.map((value: TaskKind) => (
      <Radio.Button key={value} value={value}>
        {LABELS[value]}
      </Radio.Button>
    ))}
  </Radio.Group>
));
