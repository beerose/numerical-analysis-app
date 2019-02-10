import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectProps, SelectValue } from 'antd/lib/select';
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

export const SelectSuperUser = React.forwardRef(
  (
    {
      superUsers,
      value,
      ...rest
    }: {
      superUsers: UserDTO[];
    } & SelectProps,
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
      value={superUsers.length ? value : 'undefined'}
      {...rest}
    >
      {superUsers.map(superUser => (
        <Select.Option key={String(superUser.id)} value={superUser.id}>
          {superUser.user_name}
        </Select.Option>
      ))}
    </Select>
  )
);
