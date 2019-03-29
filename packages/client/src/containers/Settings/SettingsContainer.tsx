import React, { useState, useContext } from 'react';
import { Flex, NewPasswordForm, Theme } from '../../components';
import { Modal, Button } from 'antd';
import { AuthContext } from '../../AuthContext';
import { showMessage } from '../../utils';

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
    <Flex padding={Theme.Padding.Standard} flexDirection="column">
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
    </Flex>
  );
};
