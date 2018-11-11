import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import * as React from 'react';

import { userRoleOptions } from '../../../common/roles';

type Props = {
  onChange?: (value: SelectValue) => void;
  className?: string;
  placeholder?: string;
  mode: 'single' | 'multiple';
  initialValue?: string;
};
export const SelectRole = React.forwardRef(
  (
    { onChange, className, placeholder = '', mode, initialValue }: Props,
    ref: React.Ref<Select>
  ) => (
    <Select
      showSearch={true}
      mode={mode}
      placeholder={placeholder}
      onChange={onChange}
      className={className}
      style={{ minWidth: '120px' }}
      defaultValue={initialValue}
      ref={ref}
      id="selectt"
    >
      {userRoleOptions.map(o => (
        <Select.Option value={o} key={o}>
          {o}
        </Select.Option>
      ))}
    </Select>
  )
);
