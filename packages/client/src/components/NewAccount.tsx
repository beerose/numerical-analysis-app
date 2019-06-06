/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { LABELS } from '../utils/labels';
import { useAuthStore } from '../AuthStore';

import { NewPasswordForm } from '.';
import { ModalHeader } from './ModalHeader';

const ErrorContainer = ({
  errorMessage,
  onClick,
  label,
}: {
  errorMessage?: string;
  onClick: () => void;
  label: string;
}) => (
  <section
    css={css`
      display: flex;
      flex-direction: column;
      align-items: center;
      color: red;
    `}
  >
    {errorMessage}
    <Button
      onClick={onClick}
      css={css`
        margin: 20px 0 0 0;
        align-self: center;
      `}
    >
      {label}
    </Button>
  </section>
);

const NewAccountModalHeader = () => (
  <ModalHeader title={`Witaj! ${LABELS.setNewPassword}`} />
);
const errorModalHeader = <ModalHeader title="Wystąpił błąd" />;

type State = {
  userName: string;
  localErrorMessage: string;
  token: string;
};
type Props = RouteComponentProps;
export const NewAccount: React.FC<Props> = props => {
  const { actions, errorMessage: authError, user } = useAuthStore();

  const token = new URLSearchParams(props.location.search).get('token');

  const errors = [
    !token &&
      'Do aktywacji konta potrzebujesz tokena, który znajduje się w linku wysłanym na Twój email',
    user && 'Jesteś już zalogowany',
    authError,
  ].filter(Boolean);

  return (
    <Modal
      visible
      centered
      title={errors.length ? errorModalHeader : <NewAccountModalHeader />}
      footer={null}
      width={400}
      closable={false}
    >
      {errors.length ? (
        <ErrorContainer
          errorMessage={errors.join('\n')}
          onClick={() => props.history.push('/')}
          label={user ? 'Przejdź do strony głównej' : LABELS.goToLoginPage}
        />
      ) : (
        <NewPasswordForm
          onSubmit={(password: string) =>
            actions.createNewAccount(token!, password)
          }
        />
      )}
    </Modal>
  );
};
