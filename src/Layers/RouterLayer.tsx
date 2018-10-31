import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { EditableTable } from '../Components/Users';

export const RouterLayer = () => (
  <Switch>
    <Route exact={true} path={"/"} component={() => <div>Hello</div>} />
    <Route exact={true} path={"/users"} component={() => <EditableTable />} />
  </Switch>
);
