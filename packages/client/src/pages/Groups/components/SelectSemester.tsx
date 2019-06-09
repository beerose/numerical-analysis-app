import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import React, { useContext } from 'react';

import { LocaleContext } from '../../../components/locale';
import { Colors } from '../../../utils';

// Todo: add semesters logic to the backend and db
const SEMESTERS = ['zimowy 2018/2019', 'letni 2019'];

export const SelectSemester = React.forwardRef(
  (
    {
      value,
      onChange,
      disabled,
    }: {
      value?: SelectValue;
      onChange?: (value: SelectValue) => void;
      disabled?: boolean;
    },
    ref: React.Ref<Select>
  ) => {
    const { texts } = useContext(LocaleContext);
    return (
      <Select
        showArrow
        mode="single"
        disabled={disabled}
        placeholder={
          <>
            <Icon
              type="table"
              style={{ color: Colors.SemiLightGray, marginRight: '5px' }}
            />
            {texts.semester}
          </>
        }
        value={value}
        onChange={onChange}
        ref={ref}
      >
        {SEMESTERS.map(o => (
          <Select.Option value={o} key={o}>
            {o}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
