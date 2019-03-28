import Cookies from 'js-cookie';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import { ApiResponse } from '../../../dist/common';

import { login, newAccount } from './api/authApi';
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

function handleApiError<R = {}>(res: ApiResponse & R) {
  if ('error' in res) {
    throw new Error(res.error);
  }
  return res;
}

export class AuthProvider extends React.Component<
  RouteChildrenProps,
  AuthContextState
> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      actions: {
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
    login(email, password)
      .then(handleApiError)
      .then(res => {
        this.saveCookiesState(
          res.user_name,
          res.user_role,
          res.token,
          remember
        );
        return res;
      })
      .then(res => {
        this.setState({
          token: res.token,
          userAuth: true,
          userName: res.user_name,
          userRole: res.user_role,
        });
      })
      .catch((err: Error) => {
        this.setState({ error: true, errorMessage: err.message });
      });
  };

  createNewAccount = (token: string, password: string) => {
    newAccount(token, password)
      .then(handleApiError)
      .then(res => {
        this.saveCookiesState(res.user_name, res.user_role, res.token);
        return res;
      })
      .then(res =>
        this.setState({
          token: res.token,
          userAuth: true,
          userName: res.user_name,
          userRole: res.user_role,
        })
      )
      .catch(err => {
        this.setState({ error: true, errorMessage: err.message });
      });
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
