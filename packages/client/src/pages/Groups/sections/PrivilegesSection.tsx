/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Card, Divider, Icon, Popconfirm } from 'antd';
import { UserDTO, UserRole } from 'common';
import partition from 'ramda/es/partition';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Flex, theme } from '../../../components';
import { Colors, LABELS, showMessage } from '../../../utils';
import { isAlreadyPrivilegedToEdit } from '../../../utils/isPrivilegedToEdit';
import { useAuthStore } from '../../../AuthStore';
import { SelectLecturer } from '../components/SelectLecturer';
import { GroupApiContextState } from '../GroupApiContext';

const Title = styled.span`
  font-size: 120%;
  font-weight: 600;
  margin-bottom: 10px;
  padding-right: 10px;
`;

const LecturerItem = ({
  u,
  onDelete,
}: {
  u: UserDTO;
  onDelete: () => void;
}) => (
  <span
    key={u.id}
    css={css`
      height: 100%;
      font-weight: bold;
      padding: 3px 0;
    `}
  >
    <Link to={`/users/${u.id}`}>{u.user_name}</Link>
    {u.user_role !== UserRole.Admin && (
      <Popconfirm
        title={LABELS.areYouSure}
        cancelText={LABELS.cancel}
        okText={LABELS.delete}
        onConfirm={onDelete}
      >
        <Icon
          type="close-circle"
          css={css`
            padding: 5px;
            cursor: pointer;
            * {
              fill: ${Colors.Red};
            }
          `}
        />
      </Popconfirm>
    )}
  </span>
);

type Props = GroupApiContextState & {
  editable: boolean;
};
export const PrivilegesSection = (props: Props) => {
  const [[privilegedUsers, choosableUsers], setPartitionedLecturers] = useState<
    [UserDTO[], UserDTO[]]
  >([[], []]);

  const [selectedUser, setSelectedUser] = useState<UserDTO['id'] | null>(null);

  useEffect(() => {
    updateLecturers();
  }, [props.lecturers]);

  const updateLecturers = () => {
    props.actions.listLecturers().then(lecturers => {
      const canEdit = (lecturer: UserDTO) => {
        return (
          lecturer.user_role === UserRole.Admin ||
          isAlreadyPrivilegedToEdit(
            lecturer,
            props.currentGroup && props.currentGroup.id
          )
        );
      };

      setPartitionedLecturers(partition(canEdit, lecturers));
    });
  };

  const handleShare = () => {
    if (!selectedUser) {
      showMessage({ error: 'Żaden użytkownik nie został wybrany' });
      return;
    }
    props.actions.shareForEdit(selectedUser).then(res => {
      showMessage(res);
      setSelectedUser(null);
      updateLecturers();
    });
  };

  const handleUnshare = (userId: UserDTO['id']) => {
    props.actions.unshareForEdit(userId).then(res => {
      showMessage(res);
      updateLecturers();
    });
  };

  return (
    <Flex padding={theme.Padding.Standard} flexDirection="column" as="section">
      <span>
        <Title css={{ display: 'block' }}>
          Udostępnij grupę nowemu użytkownikowi:{' '}
        </Title>
        <SelectLecturer
          lecturers={choosableUsers || []}
          onChange={v => setSelectedUser(Number(v))}
          value={selectedUser || undefined}
        />
        <Button
          type="primary"
          css={css`
            margin-left: 10px;
          `}
          disabled={!selectedUser}
          onClick={handleShare}
        >
          {LABELS.save}
        </Button>
      </span>
      <Divider />
      <Flex flexDirection="column">
        <Title css={{ display: 'block' }}>
          Osoby, które mają dostęp do edycji grupy:
        </Title>
        {privilegedUsers &&
          privilegedUsers.map(u => (
            <LecturerItem
              key={u.id}
              u={u}
              onDelete={() => handleUnshare(u.id)}
            />
          ))}
      </Flex>
    </Flex>
  );
};
