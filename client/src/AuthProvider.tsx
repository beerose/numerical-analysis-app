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
      userAuth: false,
    };
  }

  loginUser = (email: string, password: string) => {
    login(email, password).then(res => {
      if (res.error) {
        this.setState({ error: true, errorMessage: res.error });
        return;
      }
      this.setState({ userAuth: true, userName: res.user_name, userRole: res.user_role });
    });
  };

  createNewAccount = (token: string, password: string) => {
    newAccount(token, password).then(res => {
      console.log(res);
      if (res.error) {
        this.setState({ error: true, errorMessage: res.error });
        return;
      }
      this.setState({ userAuth: true, userName: res.user_name, userRole: res.user_role });
    });
  };

  render() {
    return <AuthContextProvider value={this.state}>{this.props.children}</AuthContextProvider>;
  }
}
