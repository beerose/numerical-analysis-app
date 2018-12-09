import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CreateGroupContainer, ListGroupsContainer } from '../Components/GroupsPanel';
import { EditGroupContainer } from '../Components/GroupsPanel/EditGroupContainer/';
import { NewAccount } from '../Components/NewAccount/NewAccount';
import { ListUsersContainer } from '../Components/UsersPanel/';

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
