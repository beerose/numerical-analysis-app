import { Button, Icon, Popover, Spin, Tooltip } from 'antd';
import { UserDTO } from 'common';
import React, { useEffect, useState } from 'react';

import { Flex } from '../../../components';
import { showMessage } from '../../../utils';
import { GroupApiContextState } from '../GroupApiContext';

import { SelectLecturer } from './SelectLecturer';

type PopoverContentProps = {
  lecturers?: UserDTO[];
  onShare: (id: UserDTO['id']) => void;
};
const PopoverContent = ({ lecturers, onShare }: PopoverContentProps) => {
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
        onClick={() => onShare(selectedLecturer)}
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
  'lecturers' | 'actions' | 'currentGroup'
>;
export const ShareGroupForEdit = ({
  currentGroup,
  lecturers,
  actions,
}: ShareGroupForEditProps) => {
  const [formVisible, setFormVisible] = useState(false);
  const [choosableLecturers, setChoosableLecturers] = useState<UserDTO[]>([]);

  useEffect(() => {
    if (!lecturers) {
      actions.listLecturers().then(res => {
        setChoosableLecturers(
          res.filter(l => {
            return (
              !l.privileges ||
              !l.privileges.groups ||
              (currentGroup && !l.privileges.groups[currentGroup.id]) ||
              (currentGroup && !l.privileges.groups[currentGroup.id].length)
            );
          })
        );
      });
    }
  }, [lecturers]);

  const handleShareClick = (userId: UserDTO['id']) => {
    actions.shareForEdit(userId).then(showMessage);
    setChoosableLecturers(prev => prev.filter(l => l.id !== userId));
    setFormVisible(false);
  };

  return (
    <Popover
      style={{ width: 400 }}
      content={
        <PopoverContent
          lecturers={choosableLecturers}
          onShare={handleShareClick}
        />
      }
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
