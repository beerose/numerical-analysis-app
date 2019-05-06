import { Popconfirm } from 'antd';
import React from 'react';

import { LABELS } from '../utils/labels';

export const DeleteWithConfirmation: React.FC<{
  onConfirm: (e?: React.MouseEvent<any>) => void;
  label?: React.ReactNode;
}> = ({ onConfirm, label }) => (
  <Popconfirm
    title={LABELS.areYouSure}
    onConfirm={onConfirm}
    okText={LABELS.yes}
    okType="danger"
    placement="topRight"
    cancelText={LABELS.no}
  >
    <a role="button" onClick={e => e.stopPropagation()}>
      {label ? label : LABELS.delete}
    </a>
  </Popconfirm>
);
