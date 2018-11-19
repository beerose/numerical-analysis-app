import React from 'react';

import { login, newAccount } from './api/authApi';
import { AuthContextProvider, AuthContextState } from './AuthContext';

export class AuthProvider extends React.Component<{}, AuthContextState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      actions: {
        createNewAccount: this.createNewAccount,
        login: this.loginUser,
      },
      error: false,
      token: '',
      userAuth: true,
      userName: '',
      userRole: 'admin',
    };
  }

  componentWillMount() {
    // this.loginUser('name', 'pass');
  }

  loginUser = (username: string, password: string) => {
    console.log('LOGIN');
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

  createNewAccount = (token: string, password: string) => {
    newAccount(token, password).then(res => {
      console.log(res);
      if (res.error) {
        this.setState({ error: true, errorMessage: res.error });
      }
      if (res.token && res.user_name && res.user_role) {
        this.setState({ userAuth: true, userName: res.user_name, userRole: res.user_role });
        return;
      }
    });
  };

  render() {
    return <AuthContextProvider value={this.state}>{this.props.children}</AuthContextProvider>;
  }
}
