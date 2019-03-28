import React, { useState, useContext } from 'react';
import { Flex, NewPasswordForm, Theme } from '../../components';
import { Modal, Button } from 'antd';
import { AuthContext } from '../../AuthContext';

export const SettingsContainer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const authContext = useContext(AuthContext);

  // TO DO: refactor this

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
        <NewPasswordForm onSubmit={console.log} />
      </Modal>
    </Flex>
  );
};
