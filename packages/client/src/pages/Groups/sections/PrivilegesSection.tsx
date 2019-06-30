/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Card, Divider, Icon, Popconfirm } from 'antd';
import { UserDTO, UserRole } from 'common';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DeleteWithConfirmation, Flex, theme } from '../../../components';
import { RemoveSelected } from '../../../components/RemoveSelected';
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

const conteinerStyles = css`
  padding: ${theme.Padding.Standard};
`;

const LecturerItem = ({ u }: { u: UserDTO }) => (
  <span
    key={u.id}
    css={css`
      height: 100%;
      font-weight: bold;
      padding: 3px 0;
    `}
  >
    <Popconfirm
      title={LABELS.areYouSure}
      cancelText={LABELS.cancel}
      okText={LABELS.delete}
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
    <Link to={`/users/${u.id}`}>{u.user_name}</Link>
  </span>
);

type Props = GroupApiContextState & {
  editable: boolean;
};
export const PrivilegesSection = (props: Props) => {
  const [choosableUsers, setChoosableUsers] = useState<UserDTO[] | null>(null);
  const [privilegedUsers, setPrivilegedUsers] = useState<UserDTO[] | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserDTO['id'] | null>(null);
  const activeUserId = useAuthStore(s => s.user && s.user.id);

  useEffect(() => {
    if (!choosableUsers || !privilegedUsers) {
      updateLecturers();
    }
  }, [props.lecturers]);

  const updateLecturers = () => {
    props.actions.listLecturers().then(res => {
      const choosable: UserDTO[] = [];
      const privileged: UserDTO[] = [];
      res.map(lecturer => {
        if (
          lecturer.id === activeUserId ||
          lecturer.user_role === UserRole.Admin ||
          isAlreadyPrivilegedToEdit(
            lecturer,
            props.currentGroup && props.currentGroup.id
          )
        ) {
          privileged.push(lecturer);
        } else {
          choosable.push(lecturer);
        }
      });
      setChoosableUsers(choosable);
      setPrivilegedUsers(privileged);
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

  return (
    <Flex css={conteinerStyles} flexDirection="column">
      <span>
        <Title>Udostępnij grupę nowemu użytkownikowi: </Title>
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
        <Title>Osoby, które mają dostęp do edycji grupy:</Title>
        {privilegedUsers &&
          privilegedUsers.map(u => <LecturerItem key={u.id} u={u} />)}
      </Flex>
    </Flex>
  );
};
