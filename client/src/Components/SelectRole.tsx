import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import * as React from 'react';

import { userRoleOptions } from '../utils/utils';

export const SelectRole = ({
  onChange,
  className,
  placeholder = '',
  mode,
  initialValue,
}: {
  onChange?: (value: SelectValue) => void;
  className?: string;
  placeholder?: string;
  mode: 'single' | 'multiple';
  initialValue?: string;
}) => (
  <Select
    showSearch={true}
    mode={mode}
    placeholder={placeholder}
    onChange={onChange}
    className={className}
    style={{ minWidth: '100px' }}
    defaultValue={initialValue}
  >
    {userRoleOptions.map(o => (
      <Select.Option value={o} key={o}>
        {o}
      </Select.Option>
    ))}
  </Select>
);
