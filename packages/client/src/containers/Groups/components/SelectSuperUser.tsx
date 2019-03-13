import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectProps } from 'antd/lib/select';
import { UserDTO } from 'common';
import * as React from 'react';

import { Colors, LABELS } from '../../../utils';

const filterLecturer: SelectProps['filterOption'] = (
  input,
  { props: { children } }
) =>
  children &&
  children
    .toString()
    .toLowerCase()
    .indexOf(input.toLowerCase()) >= 0;

type SelectSuperUserProps = {
  superUsers: UserDTO[];
} & SelectProps;

export const SelectSuperUser = React.forwardRef(
  (
    { superUsers, value, ...rest }: SelectSuperUserProps,
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
      filterOption={filterLecturer}
      value={superUsers.length ? value : undefined}
      {...rest}
    >
      {superUsers.map(lecturer => (
        <Select.Option key={String(lecturer.id)} value={lecturer.id}>
          {lecturer.user_name}
        </Select.Option>
      ))}
    </Select>
  )
);
