import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NewAccount } from '../components/';
import { Groups, ListUsersContainer } from '../containers';

export const RouterLayer = () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={() => <div>Hello</div>} />
      <Route exact={true} path="/users" component={ListUsersContainer} />
      <Route path="/groups" render={Groups} />
      <Route path="/accounts/new" render={routeContext => <NewAccount {...routeContext} />} />
    </Switch>
  );
};
