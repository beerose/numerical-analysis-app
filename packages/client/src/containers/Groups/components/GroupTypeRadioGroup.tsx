import { Radio } from 'antd';
import { GroupType } from 'common';
import React from 'react';

import { LABELS } from '../../../utils';

const groupTypeValues = Object.values(GroupType).reverse();

export const GroupTypeRadioGroup: React.FC = props => (
  <Radio.Group buttonStyle="solid" {...props}>
    {groupTypeValues.map((value: GroupType) => (
      <Radio.Button value={value}>{LABELS[value]}</Radio.Button>
    ))}
  </Radio.Group>
);
