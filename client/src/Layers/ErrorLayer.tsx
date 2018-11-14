import * as React from 'react';

import { ErrorMessage } from '../Components/Error';

type State = {
  hasError: boolean;
  errorMessage: string;
};
export class ErrorBoundary extends React.Component<{}, State> {
  state = { hasError: false, errorMessage: '' };

  componentDidCatch(error: Error) {
    this.setState({ hasError: false, errorMessage: error.message });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage message={this.state.errorMessage} />;
    }
    return this.props.children;
  }
}
