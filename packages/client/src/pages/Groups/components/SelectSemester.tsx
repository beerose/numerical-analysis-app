import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import React, { useContext } from 'react';

import { LocaleContext } from '../../../components/locale';
import { Colors } from '../../../utils';

const getSemesters = () => {
  const currentYear = new Date().getFullYear();
  return [
    `letni ${currentYear - 1}`,
    `zimowy ${currentYear - 1}/${currentYear}`,
    `letni ${currentYear}`,
    `zimowy ${currentYear}/${currentYear + 1}`,
    `letni ${currentYear + 1}`,
  ];
};

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
    const semesters = getSemesters();
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
        {semesters.map(o => (
          <Select.Option value={o} key={o}>
            {o}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
