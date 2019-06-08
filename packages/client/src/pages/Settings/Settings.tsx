/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, Modal } from 'antd';
import { useState } from 'react';

import { NewPasswordForm, PaddingContainer, UserInfo } from '../../components';
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

  return (
    <PaddingContainer>
      <UserInfo {...user!} />
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
