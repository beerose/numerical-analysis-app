import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CreateGroupContainer, ListGroupsContainer } from '../Components/GroupsPanel';
import { ListUsersContainer } from '../Components/UsersPanel/';

export const RouterLayer = () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={() => <div>Hello</div>} />
      <Route exact={true} path="/users" component={() => <ListUsersContainer />} />
      <Route exact={true} path="/groups" component={() => <ListGroupsContainer />} />
      <Route exact={true} path="/groups/new" component={() => <CreateGroupContainer />} />
    </Switch>
  );
};
