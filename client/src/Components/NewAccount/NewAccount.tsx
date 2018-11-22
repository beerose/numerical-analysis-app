import { Modal } from 'antd';
import jwt from 'jsonwebtoken';
import * as qs from 'query-string';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { LABELS } from '../../utils/labels';
import { AuthConsumer } from '../../AuthContext';
import { ModalHeader } from '../ModalHeader';

import { NewAccountWithTokenForm } from './NewAccountForm';

const NewAccountModalHeader = ({ userName }: { userName: string }) => (
  <ModalHeader title={`Witaj ${userName}, ${LABELS.setNewPassword}`} />
);
const errorModalHeader = <ModalHeader title="Wystąpił błąd" />;

type State = {
  userName: string;
  error: boolean;
  errorMessage: string;
  token: string;
};
type Props = RouteComponentProps;
export class NewAccount extends React.Component<Props, State> {
  state = {
    error: false,
    errorMessage: '',
    token: '',
    userName: '',
  };

  goToMainPage = () => {
    this.props.history.push('/');
  };

  componentWillMount() {
    const parsedHash = qs.parse(this.props.location.hash);
    if (!parsedHash.token) {
      this.setState({ errorMessage: LABELS.noPrivilegesToUseApp, error: true });
    }
    this.setState({ token: parsedHash.token });

    let decoded;
    try {
      decoded = jwt.verify(parsedHash.token, process.env.JWT_SECRET!) as { user_name?: string };
    } catch {
      this.setState({ errorMessage: LABELS.noPrivilegesToUseApp, error: true });
      return;
    }

    if (!decoded.user_name) {
      this.setState({ errorMessage: LABELS.noPrivilegesToUseApp, error: true });
      return;
    }

    this.setState({ userName: decoded.user_name });
  }

  render() {
    const { errorMessage, error, userName, token } = this.state;
    return (
      <AuthConsumer>
        {({ actions }) => (
          <Modal
            visible
            centered
            title={error ? errorModalHeader : <NewAccountModalHeader userName={userName} />}
            footer={null}
            width={400}
            closable={false}
          >
            {error ? (
              errorMessage
            ) : (
              <NewAccountWithTokenForm
                onSubmit={(password: string) => actions.createNewAccount(token, password)}
                goToMainPage={this.goToMainPage}
              />
            )}
          </Modal>
        )}
      </AuthConsumer>
    );
  }
}
