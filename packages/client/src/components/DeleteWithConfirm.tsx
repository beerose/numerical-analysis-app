import { Popconfirm } from 'antd';
import * as React from 'react';

import { LABELS } from '../utils/labels';

export const DeleteWithConfirm = ({
  onConfirm,
}: {
  onConfirm: (e?: React.MouseEvent<any>) => void;
}) => (
  <Popconfirm
    title={LABELS.areYouSure}
    onConfirm={onConfirm}
    okText={LABELS.yes}
    okType="danger"
    placement="topRight"
    cancelText={LABELS.no}
  >
    <a>{LABELS.delete}</a>
  </Popconfirm>
);
