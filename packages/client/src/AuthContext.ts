import * as React from 'react';

export type AuthContextState = {
  actions: {
    createNewAccount: (token: string, password: string) => void;
    login: (userName: string, password: string, remember: boolean) => void;
    goToMainPage: () => void;
    changePassword: (newPassword: string) => void;
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
    changePassword: console.log.bind(console, 'changePassword'),
  },
  error: false,
  userAuth: false,
});
