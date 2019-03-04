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

import { NewAccountWithTokenForm } from './NewAccountForm';

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
}: {
  errorMessage?: string;
  onClick: () => void;
}) => (
  <section css={errorContainerStyles}>
    {errorMessage}
    <Button onClick={onClick} css={buttonStyles}>
      {LABELS.goToLoginPage}
    </Button>
  </section>
);

const NewAccountModalHeader = ({ userName }: { userName: string }) => (
  <ModalHeader title={`Witaj ${userName}, ${LABELS.setNewPassword}`} />
);
const errorModalHeader = <ModalHeader title="Wystąpił błąd" />;

type State = {
  userName: string;
  localError: boolean;
  localErrorMessage: string;
  token: string;
};
type Props = RouteComponentProps;
export class NewAccount extends React.Component<Props, State> {
  state = {
    localError: false,
    localErrorMessage: '',
    token: '',
    userName: '',
  };

  componentWillMount() {
    const parsedHash = qs.parse(this.props.location.hash);
    if (!parsedHash.token) {
      this.setState({
        localError: true,
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }
    this.setState({ token: parsedHash.token });

    let decoded;
    try {
      decoded = jwt.verify(parsedHash.token, process.env.JWT_SECRET!) as {
        user_name?: string;
      };
    } catch (err) {
      this.setState({
        localError: true,
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }

    if (!decoded.user_name) {
      this.setState({
        localError: true,
        localErrorMessage: LABELS.magicLinkInvalid,
      });
      return;
    }

    this.setState({ userName: decoded.user_name });
  }

  render() {
    const { localErrorMessage, localError, userName, token } = this.state;
    return (
      <AuthConsumer>
        {({
          actions,
          error: authError,
          errorMessage: authErrorMessage,
          userAuth,
        }) => {
          const error = authError || localError;
          const errorMessage =
            error && localError ? localErrorMessage : authErrorMessage;
          return (
            <Modal
              visible={!userAuth}
              centered
              title={
                error ? (
                  errorModalHeader
                ) : (
                  <NewAccountModalHeader userName={userName} />
                )
              }
              footer={null}
              width={400}
              closable={false}
            >
              {error ? (
                <ErrorContainer
                  errorMessage={errorMessage}
                  onClick={actions.goToMainPage}
                />
              ) : (
                <NewAccountWithTokenForm
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
