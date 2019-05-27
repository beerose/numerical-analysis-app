import { Button, Icon, Popover, Spin, Tooltip } from 'antd';
import { UserDTO } from 'common';
import React, { useEffect, useState } from 'react';

import { Flex } from '../../../components';
import { GroupApiContextState } from '../GroupApiContext';

import { SelectLecturer } from './SelectLecturer';

type PopoverContentProps = {
  lecturers?: UserDTO[];
};
const PopoverContent = ({ lecturers }: PopoverContentProps) => {
  const [selectedLecturer, setSelectedLecturer] = useState();

  return lecturers ? (
    <Flex flexDirection="column">
      <SelectLecturer
        lecturers={lecturers}
        onChange={v => setSelectedLecturer(v)}
        value={selectedLecturer}
      />
      <Button
        style={{ marginTop: '20px', alignSelf: 'flex-end' }}
        type="primary"
      >
        Zapisz
      </Button>
    </Flex>
  ) : (
    <Spin />
  );
};

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
      style={{ width: 400 }}
      content={<PopoverContent lecturers={lecturers} />}
      title="Wybierz z listy użytkowników"
      trigger="click"
      visible={formVisible}
      onVisibleChange={setFormVisible}
      placement="right"
    >
      <Tooltip title="Udostępnij grupę do edycji innemu użytkownikowi">
        <Button onClick={() => setFormVisible(true)} style={{ width: '90%' }}>
          Udostępnij
        </Button>
      </Tooltip>
    </Popover>
  );
};
