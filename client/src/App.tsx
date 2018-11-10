import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';

import './styles.css';
import { AppProvider } from './AppProvider';
import { BaseLayer, RouterLayer } from './Layers/';

const BaseLayerWithRouter = withRouter(BaseLayer);

export class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <AppProvider>
          <BaseLayerWithRouter>
            <RouterLayer />
          </BaseLayerWithRouter>
        </AppProvider>
      </Router>
    );
  }
}
