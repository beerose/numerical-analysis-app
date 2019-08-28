/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Popconfirm } from 'antd';
import React from 'react';

import { LABELS } from '../utils/labels';

export const DeleteWithConfirmation: React.FC<{
  onConfirm: (e?: React.MouseEvent<any>) => void;
}> = ({ onConfirm, children }) => (
  <Popconfirm
    title={LABELS.areYouSure}
    onConfirm={onConfirm}
    okText={LABELS.yes}
    okType="danger"
    placement="topRight"
    cancelText={LABELS.no}
  >
    <a
      role="button"
      onClick={e => e.stopPropagation()}
      css={css`
        color: rgba(0, 0, 0, 0.35);
      `}
    >
      {children}
    </a>
  </Popconfirm>
);
