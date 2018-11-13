import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './styles.css';
import { AppProvider } from './AppProvider';
import { BaseLayer, RouterLayer } from './Layers/';
import { ErrorBoundary } from './Layers/ErrorLayer';

export class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <AppProvider>
          <ErrorBoundary>
            <Route>
              {routeContext => (
                <BaseLayer {...routeContext}>
                  <RouterLayer />
                </BaseLayer>
              )}
            </Route>
          </ErrorBoundary>
        </AppProvider>
      </Router>
    );
  }
}
