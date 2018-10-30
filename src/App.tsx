import React from "react";
import { BaseLayer, RouterLayer } from "./Layers/";
import { BrowserRouter as Router } from "react-router-dom";

export class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <BaseLayer>
          <RouterLayer />
        </BaseLayer>
      </Router>
    );
  }
}
