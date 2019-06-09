import { Radio } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';
// tslint:disable-next-line:no-submodule-imports
import RadioGroup from 'antd/lib/radio/group';
import { GroupType } from 'common';
import React from 'react';

import { LABELS } from '../../../utils';

const groupTypeValues = Object.values(GroupType).reverse();

export const GroupTypeRadioGroup = React.forwardRef<
  RadioGroup,
  RadioGroupProps
>((props, ref) => (
  <Radio.Group buttonStyle="solid" {...props} ref={ref}>
    {groupTypeValues.map((value: GroupType) => (
      <Radio.Button key={value} value={value} disabled={props.disabled}>
        {LABELS[value]}
      </Radio.Button>
    ))}
  </Radio.Group>
));
