import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import { userRoleOptions } from 'common';
import * as React from 'react';

import { Colors } from '../utils';

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
      mode={mode}
      placeholder={
        <>
          <Icon
            type="tag"
            style={{ color: Colors.SemiLightGrey, marginRight: '5px' }}
          />
          {placeholder}
        </>
      }
      onChange={onChange}
      className={className}
      style={{ minWidth: '120px' }}
      defaultValue={initialValue}
      ref={ref}
    >
      {userRoleOptions.map(o => (
        <Select.Option value={o} key={o}>
          {o}
        </Select.Option>
      ))}
    </Select>
  )
);
