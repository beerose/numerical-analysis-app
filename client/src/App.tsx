import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './styles.css';
import { AuthProvider } from './AuthProvider';
import { BaseLayer, RouterLayer } from './Layers/';

export class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <AuthProvider>
          <Route>
            {routeContext => (
              <BaseLayer {...routeContext}>
                <RouterLayer />
              </BaseLayer>
            )}
          </Route>
        </AuthProvider>
      </Router>
    );
  }
}
