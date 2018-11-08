import * as React from 'react';

export const { Consumer, Provider } = React.createContext({
  dispatch: ({  }: any) => null,
  error: false,
  errorMessage: '',
  userAuth: false,
  userName: '',
  userRole: '',
});
