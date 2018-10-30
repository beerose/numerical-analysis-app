import * as React from "react";
import { Route, Switch } from "react-router-dom";

export const RouterLayer = () => (
  <Switch>
    <Route exact={true} path={"/"} component={() => <div>Hello</div>} />
  </Switch>
);
