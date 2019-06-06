import { css } from '@emotion/core';
import { Icon, Select } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import { SelectProps } from 'antd/lib/select';
import { UserDTO } from 'common';
import * as React from 'react';

import { Theme } from '../../../components';
import { Colors, findStringifiedLowercase, LABELS } from '../../../utils';

type SelectLecturerProps = {
  lecturers?: UserDTO[];
} & SelectProps;

export const SelectLecturer = React.forwardRef(
  (
    { lecturers, value, ...rest }: SelectLecturerProps,
    ref: React.Ref<Select>
  ) => (
    <Select
      css={css`
        width: 15em;
        height: 32px;
        box-sizing: content-box;
      `}
      showSearch
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
