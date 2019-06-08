import { UserRole } from 'common';
import React, { useContext } from 'react';

import { useAuthStore } from '../AuthStore';

type VisibleForRolesProps = { [P in UserRole]?: boolean } & {
  children: React.ReactElement;
};
export const VisibleForRoles: React.FC<VisibleForRolesProps> = ({
  children,
  ...roles
}) => {
  const userRole = useAuthStore(s => s.user && s.user.user_role);
  return userRole && roles[userRole] ? children : null;
};
