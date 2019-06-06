import { Button, Modal } from 'antd';
import React, { useState } from 'react';

import { Flex, NewPasswordForm, PaddingContainer } from '../../components';
import { showMessage } from '../../utils';
import { useAuthStore } from '../../AuthStore';

export const SettingsContainer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userName, userRole, actions } = useAuthStore();

  const handleSubmit = (newPassword: string): void => {
    actions.changePassword(newPassword).then(res => {
      showMessage(res);
    });
    setModalVisible(false);
  };

  return (
    <PaddingContainer>
      <Flex paddingBottom={10}>
        <b css={{ paddingRight: 5 }}>Imię i nazwisko:</b> {userName}
      </Flex>
      <Flex paddingBottom={15}>
        <b css={{ paddingRight: 5 }}>Rola:</b> {userRole}
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
