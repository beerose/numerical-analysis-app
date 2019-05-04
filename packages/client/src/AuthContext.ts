import * as React from 'react';

import { changePassword } from './api/authApi';

export type AuthContextState = {
  actions: {
    createNewAccount: (token: string, password: string) => void;
    login: (userName: string, password: string, remember: boolean) => void;
    goToMainPage: () => void;
    changePassword: typeof changePassword;
  };
  error: boolean;
  errorMessage?: string;
  token?: string;
  userAuth: boolean;
  userName?: string;
  userRole?: string;
};

export const AuthContext = React.createContext<AuthContextState>({
  actions: {
    createNewAccount: console.log.bind(console, 'createNewAccount'),
    goToMainPage: console.log.bind(console, 'goToMainPage'),
    login: console.log.bind(console, 'login'),
    changePassword: (_newPassword: string) =>
      new Promise(_resolve => {
        message: '';
      }),
  },
  error: false,
  userAuth: false,
});
