import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import * as React from 'react';

import { Colors } from '../../../utils';
export const SelectSemester = React.forwardRef(
  (
    {
      onChange,
    }: {
      onChange?: (value: SelectValue) => void;
    },
    ref: React.Ref<Select>
  ) => (
    <Select
      showArrow
      mode="single"
      placeholder={
        <>
          <Icon
            type="table"
            style={{ color: Colors.SemiLightGrey, marginRight: '5px' }}
          />
          Rok akademicki
        </>
      }
      onChange={onChange}
      ref={ref}
    >
      {['2018/2019', '2019'].map(o => (
        <Select.Option value={o} key={o}>
          {o}
        </Select.Option>
      ))}
    </Select>
  )
);
