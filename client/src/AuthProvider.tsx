import Cookies from 'js-cookie';
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

  saveCookiesState = (longExpiration?: boolean) => {
    const { userName, userRole, token } = this.state;
    const now = new Date();
    const expirationHours = longExpiration ? 7 * 24 : 1;
    const expires = now.setHours(now.getHours() + expirationHours);

    Cookies.set('token', token || '', { expires });
    Cookies.set('user_role', userRole || '', { expires });
    Cookies.set('user_name', userName || '', { expires });
  };

  checkLocalStorageState = () => {
    const token = Cookies.get('token');
    const userName = Cookies.get('user_name');
    const userRole = Cookies.get('user_role');

    if (!token || !userName || !userRole) {
      return this.resetState();
    }

    this.setState({ userRole, userName, userAuth: true });
  };

  componentWillMount() {
    this.checkLocalStorageState();
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
      this.saveCookiesState(remember);
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
      this.saveCookiesState();
    });
  };

  render() {
    return <AuthContextProvider value={this.state}>{this.props.children}</AuthContextProvider>;
  }
}
