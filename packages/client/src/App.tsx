// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// tslint:disable-next-line:no-import-side-effect
import './styles.css';
import { AuthProvider } from './AuthContext';
import { Main } from './Main';

export class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Route>
          {routeContext => (
            <AuthProvider {...routeContext}>
              <Main {...routeContext} />
            </AuthProvider>
          )}
        </Route>
      </Router>
    );
  }
}
