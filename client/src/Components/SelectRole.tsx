import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import * as React from 'react';

import { LABELS } from '../utils/labels';
import { userRoleOptions } from '../utils/utils';

export const SelectRole = ({
  onChange,
  className,
}: {
  onChange: (value: SelectValue) => void;
  className?: string;
}) => (
  <Select
    mode="multiple"
    placeholder={LABELS.searchByRolePlaceholder}
    onChange={onChange}
    className={className}
  >
    {userRoleOptions.map(o => (
      <Select.Option key={o}>{o}</Select.Option>
    ))}
  </Select>
);
