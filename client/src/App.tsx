import React from "react";
import { BaseLayer, RouterLayer } from "./Layers/";
import { BrowserRouter as Router, withRouter } from "react-router-dom";

import 'antd/dist/antd.css';
import "./styles.css";
import { AppProvider } from './AppProvider';

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
