import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { UsersPanelContainer } from '../Components/UsersPanel/';

export const RouterLayer = () => (
  <Switch>
    <Route exact={true} path={"/"} component={() => <div>Hello</div>} />
    <Route exact={true} path={"/users"} component={() => <UsersPanelContainer />} />
  </Switch>
);
