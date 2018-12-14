import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NewAccount } from '../Components/';
import {
  CreateGroupContainer,
  EditGroupContainer,
  ListGroupsContainer,
  ListUsersContainer,
} from '../Containers';

export const RouterLayer = () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={() => <div>Hello</div>} />
      <Route exact={true} path="/users" component={() => <ListUsersContainer />} />
      <Route
        exact={true}
        path="/groups"
        render={routeContext => <ListGroupsContainer {...routeContext} />}
      />
      <Route
        exact={true}
        path="/groups/new"
        render={routeContext => <CreateGroupContainer {...routeContext} />}
      />
      <Route
        path="/groups/:id/:section"
        render={routeContext => <EditGroupContainer {...routeContext} />}
      />
      <Route path="/groups/:id" render={routeContext => <EditGroupContainer {...routeContext} />} />
      <Route path="/accounts/new" render={routeContext => <NewAccount {...routeContext} />} />
    </Switch>
  );
};
