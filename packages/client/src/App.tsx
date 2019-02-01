// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { BaseLayer } from './layers/';
// tslint:disable-next-line:no-import-side-effect
import './styles.css';
import { AuthProvider } from './AuthProvider';

export class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Route>
          {routeContext => (
            <AuthProvider {...routeContext}>
              <BaseLayer {...routeContext} />
            </AuthProvider>
          )}
        </Route>
      </Router>
    );
  }
}
