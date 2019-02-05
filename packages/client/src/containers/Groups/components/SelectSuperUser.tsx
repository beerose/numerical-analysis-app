import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import { UserDTO } from 'common';
import * as React from 'react';

import { Colors, LABELS } from '../../../utils';
export const SelectSuperUser = React.forwardRef(
  (
    {
      superUsers,
      onChange,
    }: {
      superUsers: UserDTO[];
      onChange?: (value: SelectValue) => void;
    },
    ref: React.Ref<Select>
  ) => (
    <Select
      showArrow
      placeholder={
        <>
          <Icon
            type="user"
            style={{ color: Colors.SemiLightGrey, marginRight: '5px' }}
          />
          {LABELS.superUser}
        </>
      }
      onChange={onChange}
      ref={ref}
    >
      {superUsers.map(superUser => (
        <Select.Option key={String(superUser.id)} value={superUser.id}>
          {superUser.user_name}
        </Select.Option>
      ))}
    </Select>
  )
);
