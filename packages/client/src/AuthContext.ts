import * as React from 'react';

export type AuthContextState = {
  actions: {
    createNewAccount: (token: string, password: string) => void;
    login: (userName: string, password: string, remember: boolean) => void;
    goToMainPage: () => void;
  };
  error: boolean;
  errorMessage?: string;
  token?: string;
  userAuth: boolean;
  userName?: string;
  userRole?: string;
};

export const { Consumer: AuthConsumer, Provider: AuthContextProvider } = React.createContext<
  AuthContextState
>({} as AuthContextState);
