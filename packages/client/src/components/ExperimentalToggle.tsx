/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon } from 'antd';
import React from 'react';
import { Assign } from 'utility-types';

import { ResetButton } from './ResetButton';

type ExperimentalToggleProps = Assign<
  React.ComponentProps<'button'>,
  {
    value: boolean;
  }
>;

export const ExperimentalToggle: React.FC<ExperimentalToggleProps> = ({
  value,
  ...rest
}) => (
  <ResetButton
    type="button"
    css={css`
      margin-left: 0.5em;
      background: transparent;
      border-radius: 2px;
      :hover {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 2px;
      }
    `}
    {...rest}
  >
    <Icon type={value ? 'close' : 'experiment'} />
  </ResetButton>
);
