import { Radio } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import RadioGroup from 'antd/lib/radio/group';
import { GroupType } from 'common';
import React from 'react';

import { LABELS } from '../../../utils';

const groupTypeValues = Object.values(GroupType).reverse();

export const GroupTypeRadioGroup = React.forwardRef<RadioGroup>(
  (props, ref) => (
    <Radio.Group buttonStyle="solid" {...props} ref={ref}>
      {groupTypeValues.map((value: GroupType) => (
        <Radio.Button key={value} value={value}>
          {LABELS[value]}
        </Radio.Button>
      ))}
    </Radio.Group>
  )
);
