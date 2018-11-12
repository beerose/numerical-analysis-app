import React from 'react';

import { AuthProvider } from './AuthContext';

type State = {
  userAuth: boolean;
  userName: string;
  userRole: string;
  error: boolean;
  errorMessage?: string;
};

export class AppProvider extends React.Component<{}, State> {
  state = {
    error: false,
    errorMessage: 'Fetch failed.',
    userAuth: true,
    userName: '',
    userRole: 'admin',
  };
  render() {
    return <AuthProvider value={this.state}>{this.props.children}</AuthProvider>;
  }
}
