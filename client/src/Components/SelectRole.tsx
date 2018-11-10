import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import * as React from 'react';

import { userRoleOptions } from '../utils/utils';

export const SelectRole = ({
  onChange,
  className,
  placeholder,
}: {
  onChange?: (value: SelectValue) => void;
  className?: string;
  placeholder: string;
}) => (
  <Select
    mode="multiple"
    placeholder={placeholder}
    onChange={onChange}
    className={className}
  >
    {userRoleOptions.map(o => (
      <Select.Option key={o}>{o}</Select.Option>
    ))}
  </Select>
);
