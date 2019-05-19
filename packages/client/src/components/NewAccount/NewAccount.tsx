/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Modal } from 'antd';
import jwt from 'jsonwebtoken';
import * as qs from 'query-string';
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { NewPasswordForm } from '../';
import { ModalHeader } from '../../components/ModalHeader';
import { useMergeState } from '../../utils';
import { LABELS } from '../../utils/labels';
import useRouter from '../../utils/useRouter';
import { useAuthStore } from '../../AuthStore';

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

const NewAccountModalHeader = ({ userName }: { userName: string }) => (
  <ModalHeader title={`Witaj ${userName}, ${LABELS.setNewPassword}`} />
);
const errorModalHeader = <ModalHeader title="Wystąpił błąd" />;

type State = {
  userName: string;
  localErrorMessage: string;
  token: string;
};
type Props = RouteComponentProps;
export const NewAccount: React.FC<Props> = props => {
  const [{ localErrorMessage, userName, token }, setState] = useMergeState({
    localErrorMessage: '',
    token: '',
    userName: '',
  });
  const { actions, errorMessage: authErrorMessage, userAuth } = useAuthStore();
  const { ...routerProps } = useRouter();
  console.log({ routerProps });

  useEffect(() => {
    const qsToken = String(qs.parse(props.location.hash).token || '');

    if (!qsToken) {
      setState({
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }
    setState({ token: qsToken });

    let decoded;
    try {
      decoded = jwt.verify(qsToken, process.env.JWT_SECRET || '') as {
        user_name?: string;
      };
    } catch (err) {
      setState({
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }

    if (!decoded.user_name) {
      setState({
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }

    setState({ userName: decoded.user_name });
  });

  const errorMessage = userAuth
    ? 'Jesteś już zalogowany'
    : localErrorMessage || authErrorMessage;

  return (
    <Modal
      visible
      centered
      title={
        errorMessage ? (
          errorModalHeader
        ) : (
          <NewAccountModalHeader userName={userName} />
        )
      }
      footer={null}
      width={400}
      closable={false}
    >
      {errorMessage ? (
        <ErrorContainer
          errorMessage={errorMessage}
          onClick={() => console.log('oopsie')}
          label={userAuth ? 'Przejdź do strony głównej' : LABELS.goToLoginPage}
        />
      ) : (
        <NewPasswordForm
          onSubmit={(password: string) =>
            actions.createNewAccount(token, password)
          }
        />
      )}
    </Modal>
  );
};
