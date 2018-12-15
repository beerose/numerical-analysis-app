// tslint:disable-next-line:no-import-side-effect
import 'antd/dist/antd.css';
import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// tslint:disable-next-line:no-import-side-effect
import './styles.css';
import { AuthProvider } from './AuthProvider';
import { BaseLayer, RouterLayer } from './Layers/';

export class App extends React.Component {
  render() {
    return (
      <StrictMode>
        <Router basename={process.env.PUBLIC_URL}>
          <Route>
            {routeContext => (
              <AuthProvider {...routeContext}>
                <BaseLayer {...routeContext}>
                  <RouterLayer />
                </BaseLayer>
              </AuthProvider>
            )}
          </Route>
        </Router>
      </StrictMode>
    );
  }
}
