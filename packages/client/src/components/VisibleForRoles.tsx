import { UserRole } from 'common';
import React, { useContext } from 'react';

import { AuthContext } from '../AuthContext';

type VisibleForRolesProps = { [P in UserRole]?: boolean } & {
  children: React.ReactElement;
};
export const VisibleForRoles: React.FC<VisibleForRolesProps> = ({
  children,
  ...roles
}) => {
  const { userRole } = useContext(AuthContext);
  return userRole && roles[userRole] ? children : null;
};
