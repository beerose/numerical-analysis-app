import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import { UserRole, userRoleOptions } from 'common';
import React, { useContext } from 'react';

import { Colors } from '../utils';

import { LocaleContext } from './locale';

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
  ) => {
    const { texts } = useContext(LocaleContext);

    return (
      <Select
        mode={mode}
        placeholder={
          <>
            <Icon
              type="tag"
              style={{ color: Colors.SemiLightGray, marginRight: '5px' }}
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
        {UserRole.All.map(role => (
          <Select.Option value={role} key={role}>
            {texts[role]}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
