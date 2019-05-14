import { Button, Modal } from 'antd';
import React, { useContext, useState } from 'react';

import { Flex, NewPasswordForm, PaddingContainer } from '../../components';
import { showMessage } from '../../utils';
import { AuthContext } from '../../AuthContext';

export const SettingsContainer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = (newPassword: string): void => {
    authContext.actions.changePassword(newPassword).then(res => {
      showMessage(res);
    });
    setModalVisible(false);
  };

  return (
    <PaddingContainer>
      <Flex paddingBottom={10}>
        <b style={{ paddingRight: 5 }}>Imię i nazwisko:</b>{' '}
        {authContext.userName}
      </Flex>
      <Flex paddingBottom={15}>
        <b style={{ paddingRight: 5 }}>Rola:</b> {authContext.userRole}
      </Flex>
      <Button style={{ width: 150 }} onClick={() => setModalVisible(true)}>
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
