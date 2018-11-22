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

  resetState = () => {
    this.setState({ userAuth: false, userRole: undefined, userName: undefined });
  };

  saveLocalStorageState = (longExpired?: boolean) => {
    const { userName, userRole, token } = this.state;
    const now = new Date();
    const expirationHours = longExpired ? 7 * 24 : 24;
    const expires = now.setHours(now.getHours() + expirationHours);
    localStorage.setItem('token', JSON.stringify({ token, token_expires: expires.toString() }));
    localStorage.setItem('user', JSON.stringify({ user_role: userRole, user_name: userName }));
  };

  checkLocalStorageState = () => {
    const storageToken = localStorage.getItem('token');
    const storageUser = localStorage.getItem('user');
    if (!storageToken || !storageUser) {
      return this.resetState();
    }
    const { token, token_expires } = JSON.parse(storageToken);
    const { user_name, user_role } = JSON.parse(storageUser);
    if (token && user_role && user_name && token_expires) {
      const now = new Date();
      if (token_expires <= now) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return this.resetState();
      }
      this.setState({ userAuth: true, userRole: user_role, userName: user_name });
    }
  };

  componentWillMount() {
    this.checkLocalStorageState();
    // return setInterval(this.checkLocalStorageState, 3000); // 10 minutes
  }

  loginUser = (email: string, password: string, remember: boolean) => {
    login(email, password).then(res => {
      if (res.error) {
        this.setState({ error: true, errorMessage: res.error });
        return;
      }
      if (!res.token || !res.user_name || !res.user_role) {
        this.setState({ error: true, errorMessage: 'Nieprawidłowa odpowiedź z serwera' });
        return;
      }
      this.setState({
        token: res.token,
        userAuth: true,
        userName: res.user_name,
        userRole: res.user_role,
      });
      this.saveLocalStorageState(remember);
    });
  };

  createNewAccount = (token: string, password: string) => {
    newAccount(token, password).then(res => {
      if (res.error) {
        this.setState({ error: true, errorMessage: res.error });
        return;
      }
      if (!res.token || !res.user_name || !res.user_role) {
        this.setState({ error: true, errorMessage: 'Nieprawidłowa odpowiedź z serwera' });
        return;
      }
      this.setState({
        token: res.token,
        userAuth: true,
        userName: res.user_name,
        userRole: res.user_role,
      });
      this.saveLocalStorageState();
    });
  };

  render() {
    return <AuthContextProvider value={this.state}>{this.props.children}</AuthContextProvider>;
  }
}
