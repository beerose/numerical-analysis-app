import { Popconfirm } from 'antd';
import React from 'react';

import { LABELS } from '../utils/labels';

export const DeleteWithConfirm: React.FC<{
  onConfirm: (e?: React.MouseEvent<any>) => void;
}> = ({ onConfirm }) => (
  <Popconfirm
    title={LABELS.areYouSure}
    onConfirm={onConfirm}
    okText={LABELS.yes}
    okType="danger"
    placement="topRight"
    cancelText={LABELS.no}
  >
    <a role="button" onClick={e => e.stopPropagation()}>
      {LABELS.delete}
    </a>
  </Popconfirm>
);
