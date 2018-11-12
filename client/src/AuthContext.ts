import * as React from 'react';

type AuthContext = {
  error: boolean;
  errorMessage: string;
  userAuth: boolean;
  userName: string;
  userRole: string;
};

export const { Consumer: AuthConsumer, Provider: AuthProvider } = React.createContext<AuthContext>(
  {} as AuthContext
);
