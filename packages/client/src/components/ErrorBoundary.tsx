import * as React from 'react';

import { ErrorMessage } from './Error';

type State = {
  error?: Error;
};

export class ErrorBoundary extends React.Component<{}, State> {
  state: State = {};

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <ErrorMessage message={error.toString()} />;
    }
    return this.props.children;
  }
}
