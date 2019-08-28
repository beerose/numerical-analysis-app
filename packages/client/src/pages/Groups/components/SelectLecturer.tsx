/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectProps } from 'antd/lib/select';
import { UserDTO, UserId } from 'common';
import * as React from 'react';

import { Colors, findStringifiedLowercase, LABELS } from '../../../utils';

type SelectLecturerProps = {
  lecturers?: UserDTO[];
} & SelectProps<UserId>;

export const SelectLecturer = React.forwardRef(
  (
    { lecturers, value, ...rest }: SelectLecturerProps,
    ref: React.Ref<Select<UserId>>
  ) => (
    <Select<UserId>
      css={css`
        width: 15em;
        height: 32px;
        box-sizing: content-box;
      `}
      showSearch
      disabled={rest.disabled}
      placeholder={
        <span>
          <Icon
            type="user"
            style={{ color: Colors.SemiLightGray, marginRight: '5px' }}
          />
          {LABELS.lecturer}
        </span>
      }
      ref={ref}
      filterOption={findStringifiedLowercase}
      value={lecturers && lecturers.length ? value : undefined}
      {...rest}
    >
      {lecturers &&
        lecturers.map(lecturer => (
          <Select.Option key={String(lecturer.id)} value={lecturer.id}>
            {lecturer.user_name}
          </Select.Option>
        ))}
    </Select>
  )
);
