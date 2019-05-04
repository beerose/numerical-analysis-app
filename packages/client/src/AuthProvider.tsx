import Cookies from 'js-cookie';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import * as authService from './api/authApi';
import { AuthContext, AuthContextState } from './AuthContext';

const getUserFromLocalStorage = () => {
  const token = Cookies.get('token');
  const userName = Cookies.get('user_name');
  const userRole = Cookies.get('user_role');

  if (!token || !userName || !userRole) {
    return;
  }

  return { userRole, userName, userAuth: true };
};

export class AuthProvider extends React.Component<
  RouteChildrenProps,
  AuthContextState
> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      actions: {
        changePassword: this.changePassword,
        createNewAccount: this.createNewAccount,
        goToMainPage: this.goToMainPage,
        login: this.loginUser,
      },
      error: false,
      userAuth: false,
      ...getUserFromLocalStorage(),
    };
  }

  goToMainPage = () => {
    this.setState({ error: false, errorMessage: '' });
    this.props.history.push('/');
  };

  resetState = () => {
    this.setState({
      userAuth: false,
      userName: undefined,
      userRole: undefined,
    });
  };

  saveCookiesState = (
    userName: string,
    userRole: string,
    token: string,
    longExpiration: boolean = false
  ) => {
    const now = new Date();
    const expirationHours = longExpiration ? 7 * 24 : 1;
    const expires = now.setHours(now.getHours() + expirationHours);

    Cookies.set('token', token || '', { expires });
    Cookies.set('user_role', userRole || '', { expires });
    Cookies.set('user_name', userName || '', { expires });
  };

  loginUser = (email: string, password: string, remember: boolean) => {
    authService
      .login(email, password)
      .then(res => {
        if ('error' in res) {
          throw new Error(res.error);
        }
        this.saveCookiesState(
          res.user_name,
          res.user_role,
          res.token,
          remember
        );
        this.setState({
          token: res.token,
          userAuth: true,
          userName: res.user_name,
          userRole: res.user_role,
        });
        return res;
      })
      .catch((err: Error) => {
        this.setState({ error: true, errorMessage: err.message });
      });
  };

  createNewAccount = (token: string, password: string) => {
    authService
      .newAccount(token, password)
      .then(res => {
        if ('error' in res) {
          throw new Error(res.error);
        }
        this.saveCookiesState(res.user_name, res.user_role, res.token);
        this.setState({
          token: res.token,
          userAuth: true,
          userName: res.user_name,
          userRole: res.user_role,
        });
        return res;
      })
      .catch(err => {
        this.setState({ error: true, errorMessage: err.message });
      });
  };

  changePassword = async (newPassword: string) => {
    const res = await authService.changePassword(newPassword);
    return res;
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
