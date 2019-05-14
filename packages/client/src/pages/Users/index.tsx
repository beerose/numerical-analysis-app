import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { ListUsersContainer } from './ListUsers';
import UserDetailsPage from './UserDetailsPage';

export type UsersProps = RouteComponentProps;
export const Users: React.FC<UsersProps> = props => {
  return (
    <Switch>
      <Route exact={true} path="/users" component={ListUsersContainer} />
      <Route path="/users/:id" render={UserDetailsPage} />
    </Switch>
  );
};

export default Users;
