// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// tslint:disable-next-line:no-import-side-effect
import { IfUserPrivileged } from './components/IfUserPrivileged';
import './styles.css';
import { Main } from './Main';

export class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Route>{routeContext => <Main {...routeContext} />}</Route>
        <IfUserPrivileged />
      </Router>
    );
  }
}
