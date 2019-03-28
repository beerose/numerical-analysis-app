/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Modal } from 'antd';
import jwt from 'jsonwebtoken';
import * as qs from 'query-string';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ModalHeader } from '../../components/ModalHeader';
import { LABELS } from '../../utils/labels';
import { AuthConsumer } from '../../AuthContext';

import { NewPasswordForm } from '../';

const errorContainerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: red;
`;
const buttonStyles = css`
  margin: 20px 0 0 0;
  align-self: center;
`;
const ErrorContainer = ({
  errorMessage,
  onClick,
  label,
}: {
  errorMessage?: string;
  onClick: () => void;
  label: string;
}) => (
  <section css={errorContainerStyles}>
    {errorMessage}
    <Button onClick={onClick} css={buttonStyles}>
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
export class NewAccount extends React.Component<Props, State> {
  state = {
    localErrorMessage: '',
    token: '',
    userName: '',
  };

  componentDidMount() {
    const parsedHash = qs.parse(this.props.location.hash);
    if (!parsedHash.token) {
      this.setState({
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }
    this.setState({ token: parsedHash.token });

    let decoded;
    try {
      decoded = jwt.verify(parsedHash.token, process.env.JWT_SECRET || '') as {
        user_name?: string;
      };
    } catch (err) {
      this.setState({
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }

    if (!decoded.user_name) {
      this.setState({
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }

    this.setState({ userName: decoded.user_name });
  }

  render() {
    const { localErrorMessage, userName, token } = this.state;
    return (
      <AuthConsumer>
        {({ actions, errorMessage: authErrorMessage, userAuth }) => {
          let errorMessage;
          if (userAuth) {
            errorMessage = 'Jesteś już zalogowany';
          } else {
            errorMessage = localErrorMessage
              ? localErrorMessage
              : authErrorMessage;
          }
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
                  onClick={actions.goToMainPage}
                  label={
                    userAuth
                      ? 'Przejdź do strony głównej'
                      : LABELS.goToLoginPage
                  }
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
        }}
      </AuthConsumer>
    );
  }
}
