import { Button, Form, Icon, Input, Modal } from 'antd';
import jwt from 'jsonwebtoken';
import * as qs from 'query-string';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { LABELS } from '../../utils/labels';
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
};
type Props = RouteComponentProps;
export class NewAccount extends React.Component<Props, State> {
  state = {
    error: false,
    errorMessage: '',
    userName: '',
  };

  componentWillMount() {
    const parsedHash = qs.parse(this.props.location.hash);
    if (!parsedHash.token) {
      this.setState({ errorMessage: 'Brak uprawnień', error: true });
    }

    let decoded;
    try {
      decoded = jwt.verify(parsedHash.token, process.env.JWT_SECRET!);
    } catch {
      this.setState({ errorMessage: 'Brak uprawnień, nieprawidłowy token', error: true });
      return;
    }

    if (typeof decoded !== 'object') {
      this.setState({ errorMessage: 'Brak uprawnień, nieprawidłowy token', error: true });
      return;
    }

    if (!(decoded as { user_name?: string }).user_name) {
      this.setState({ errorMessage: 'Brak uprawnień, nieprawidłowy token', error: true });
      return;
    }

    this.setState({
      // error: true,
      // errorMessage: 'Brak uprawnień, nieprawidłowy token',
      userName: (decoded as { user_name: string }).user_name,
    });
  }
  render() {
    const { errorMessage, error, userName } = this.state;
    return (
      <Modal
        visible
        centered
        title={error ? errorModalHeader : <NewAccountModalHeader userName={userName} />}
        footer={null}
        width={400}
        closable={false}
      >
        {error ? errorMessage : <NewAccountWithTokenForm />}
      </Modal>
    );
  }
}
