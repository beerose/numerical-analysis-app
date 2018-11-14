import React from 'react';

import { AuthContextProvider } from './AuthContext';

type State = {
  userAuth: boolean;
  userName: string;
  userRole: string;
  error: boolean;
  errorMessage?: string;
};

export class AuthProvider extends React.Component<{}, State> {
  state = {
    error: false,
    errorMessage: 'Fetch failed.',
    userAuth: false,
    userName: '',
    userRole: 'admin',
  };
  render() {
    return <AuthContextProvider value={this.state}>{this.props.children}</AuthContextProvider>;
  }
}
