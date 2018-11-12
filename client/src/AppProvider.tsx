import React from 'react';

import { AuthProvider } from './AuthContext';

const reducer = (state: any, action: any) => {
  if (action.type === 'AUTH') {
    return { ...state, userAuth: action.payload.userAuth };
  }
};

type State = {
  userAuth: boolean;
  userName: string;
  userRole: string;
  dispatch: (action: any) => void;
  error: boolean;
  errorMessage?: string;
};

export class AppProvider extends React.Component<{}, State> {
  state = {
    dispatch: (action: any) => {
      this.setState(state => reducer(state, action));
    },
    error: false,
    errorMessage: 'Fetch failed.',
    userAuth: false,
    userName: '',
    userRole: 'admin',
  };
  render() {
    return <AuthProvider value={this.state}>{this.props.children}</AuthProvider>;
  }
}
