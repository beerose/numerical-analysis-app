import * as React from 'react';

import { ErrorMessage } from '../components/Error';

type ErrorMsg = string;
type State = {
  error?: ErrorMsg;
};
export class ErrorBoundary extends React.Component<{}, State> {
  state: State = {};

  componentDidCatch(error: Error) {
    this.setState({ error: error.message });
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage message={this.state.error} />;
    }
    return this.props.children;
  }
}
