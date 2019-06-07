/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, Modal } from 'antd';
import { useState } from 'react';

import { Flex, NewPasswordForm, PaddingContainer } from '../../components';
import { showMessage } from '../../utils';
import { useAuthStore } from '../../AuthStore';

export const SettingsContainer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  // tslint:disable-next-line:no-shadowed-variable
  const { user, changePassword } = useAuthStore(({ user, actions }) => ({
    user,
    changePassword: actions.changePassword,
  }));

  const handleSubmit = (newPassword: string): void => {
    changePassword(newPassword).then(res => {
      showMessage(res);
    });
    setModalVisible(false);
  };

  const { user_name, user_role, email } = user!;

  return (
    <PaddingContainer>
      <Flex paddingBottom={10}>
        <b css={{ paddingRight: 5 }}>Imię i nazwisko:</b> {user_name}
      </Flex>
      <Flex paddingBottom={10}>
        <b css={{ paddingRight: 5 }}>Email:</b> {email}
      </Flex>
      <Flex paddingBottom={15}>
        <b css={{ paddingRight: 5 }}>Rola:</b> {user_role}
      </Flex>
      <Button css={{ width: 150 }} onClick={() => setModalVisible(true)}>
        Zmień hasło
      </Button>
      <Modal
        width={400}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={false}
      >
        <NewPasswordForm onSubmit={handleSubmit} />
      </Modal>
    </PaddingContainer>
  );
};
