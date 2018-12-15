import React from 'react';
import { Route, Switch } from 'react-router';

import { CreateGroupContainer } from './CreateGroupContainer';
import { EditGroupContainer } from './EditGroupContainer';
import { ListGroupsContainer } from './ListGroupsContainer';

export const Groups = () => (
  <Switch>
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
    <Route path="/groups/:id" render={routeContext => <EditGroupContainer {...routeContext} />} />
  </Switch>
);
