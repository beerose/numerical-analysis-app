import React from 'react';
import { Route, Switch } from 'react-router';

import { ListUsersContainer } from './ListUsers';
import UserDetailsPage from './UserDetailsPage';

export type UsersProps = {};
export const Users: React.FC<UsersProps> = () => {
  return (
    <Switch>
      <Route exact={true} path="/users" component={ListUsersContainer} />
      <Route path="/users/:id" component={UserDetailsPage} />
    </Switch>
  );
};

export default Users;
