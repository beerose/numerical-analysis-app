import React from 'react';
import { Route, RouteChildrenProps, Switch } from 'react-router';

import { CreateGroupContainer } from './CreateGroupContainer';
import { GroupApiProvider } from './GroupApiContext';
import { GroupDetailsContainer } from './GroupDetailsContainer';
import { ListGroupsContainer } from './ListGroupsContainer';

export const Groups = (props: RouteChildrenProps) => {
  return (
    <GroupApiProvider {...props}>
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
        <Route
          path="/groups/:id"
          render={routeContext => <GroupDetailsContainer {...routeContext} />}
        />
      </Switch>
    </GroupApiProvider>
  );
};
