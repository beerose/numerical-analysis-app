import * as React from 'react';

export const { Consumer: AuthConsumer, Provider: AuthProvider } = React.createContext({
  dispatch: ({  }: any) => undefined as void,
  error: false,
  errorMessage: '',
  userAuth: false,
  userName: '',
  userRole: '',
});
