import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectProps } from 'antd/lib/select';
import { UserDTO } from 'common';
import * as React from 'react';

import { Colors, findStringifiedLowercase, LABELS } from '../../../utils';

type SelectSuperUserProps = {
  lecturers: UserDTO[];
} & SelectProps;

export const SelectLecturer = React.forwardRef(
  (
    { lecturers, value, ...rest }: SelectSuperUserProps,
    ref: React.Ref<Select>
  ) => (
    <Select
      showSearch
      placeholder={
        <>
          <Icon
            type="user"
            style={{ color: Colors.SemiLightGrey, marginRight: '5px' }}
          />
          {LABELS.lecturer}
        </>
      }
      ref={ref}
      filterOption={findStringifiedLowercase}
      value={lecturers.length ? value : undefined}
      {...rest}
    >
      {lecturers.map(lecturer => (
        <Select.Option key={String(lecturer.id)} value={lecturer.id}>
          {lecturer.user_name}
        </Select.Option>
      ))}
    </Select>
  )
);
