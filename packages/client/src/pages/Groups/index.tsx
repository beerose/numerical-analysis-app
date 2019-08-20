import { UserRole } from 'common';
import React from 'react';
import { Route, Switch } from 'react-router';

import { useAuthStore } from '../../AuthStore';

import { CreateGroupContainer } from './CreateGroupContainer';
import { GroupDetailsContainer } from './GroupDetailsContainer';
import { ListGroupsContainer } from './ListGroupsContainer';
import { StudentGroupsListContainer } from './StudentGroupsListContainer';
import { StudentGroupDetailsContainer } from './StudentGroupDetailsContainer';
import { StudentTaskDetailsContainer } from './StudentTaskDetailsContainer';

export const Groups = () => {
  const userRole = useAuthStore(s => s.user && s.user.user_role);

  if (userRole === UserRole.Student) {
    return (
      <Switch>
        <Route exact path="/groups" component={StudentGroupsListContainer} />
        <Route
          exact
          path="/groups/:id"
          component={StudentGroupDetailsContainer}
        />
        <Route
          exact
          path="/groups/:groupId/tasks/:taskId"
          component={StudentTaskDetailsContainer}
        />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route exact path="/groups" component={ListGroupsContainer} />
      <Route exact path="/groups/new" component={CreateGroupContainer} />
      <Route path="/groups/:id" component={GroupDetailsContainer} />
    </Switch>
  );
};
