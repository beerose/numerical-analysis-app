import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { CreateGroupContainer } from './CreateGroup';
import { GroupApiProvider } from './GroupApiContext';
import { GroupDetailsContainer } from './GroupDetails';
import { ListGroupsContainer } from './ListGroups';

export const Groups = (props: RouteComponentProps) => {
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
