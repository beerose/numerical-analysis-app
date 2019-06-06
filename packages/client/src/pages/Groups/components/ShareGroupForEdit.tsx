import { Button, Icon, Popover, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

import { UserDTO } from '../../../../../../dist/common';
import { GroupApiContextState } from '../GroupApiContext';

import { SelectLecturer } from './SelectLecturer';

type PopoverContentProps = {
  lecturers?: UserDTO[];
};
const PopoverContent = ({ lecturers }: PopoverContentProps) =>
  lecturers ? <SelectLecturer lecturers={lecturers} /> : <Spin />;

type ShareGroupForEditProps = Pick<
  GroupApiContextState,
  'lecturers' | 'actions'
>;
export const ShareGroupForEdit = ({
  lecturers,
  actions,
}: ShareGroupForEditProps) => {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (!lecturers) {
      actions.listLecturers();
    }
  }, [lecturers]);

  return (
    <Popover
      content={<PopoverContent lecturers={lecturers} />}
      title="Wybierz z listy użytkowników"
      trigger="click"
      visible={formVisible}
      onVisibleChange={() => setFormVisible(true)}
      placement="right"
    >
      <Tooltip title="Udostępnij grupę do edycji innemu użytkownikowi">
        <Button onClick={() => setFormVisible(true)} css={{ width: '90%' }}>
          Udostępnij
        </Button>
      </Tooltip>
    </Popover>
  );
};
