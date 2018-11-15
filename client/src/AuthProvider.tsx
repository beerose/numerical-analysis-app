import React from 'react';

import { login } from './api/authApi';
import { AuthContextProvider } from './AuthContext';

type State = {
  userAuth: boolean;
  userName: string;
  userRole: string;
  error: boolean;
  errorMessage?: string;
};

export class AuthProvider extends React.Component<{}, State> {
  state = {
    error: false,
    errorMessage: 'Fetch failed.',
    userAuth: false,
    userName: '',
    userRole: '',
  };

  componentWillMount() {
    this.loginUser('name', 'pass');
  }

  loginUser = (username: string, password: string) => {
    login(username, password).then(res => {
      console.log(res);
      if (res.error) {
        this.setState({ error: true, errorMessage: res.error });
        return;
      }
      if (res.token && res.user_name && res.user_role) {
        this.setState({ userAuth: true, userName: res.user_name, userRole: 'admin' });
        return;
      }
    });
  };

  render() {
    return (
      <AuthContextProvider value={{ login: this.loginUser, ...this.state }}>
        {this.props.children}
      </AuthContextProvider>
    );
  }
}
