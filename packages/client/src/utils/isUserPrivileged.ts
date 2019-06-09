import { UserPrivileges, UserRole } from 'common';

import { useAuthStore } from '../AuthStore';

export const isUserPrivileged = (
  to: UserPrivileges.What[],
  resource: UserPrivileges.Where,
  withId: number
): boolean => {
  const user = useAuthStore(state => state.user);

  if (user && user.user_role === UserRole.Admin) {
    return true;
  }

  if (!user || !user.privileges) {
    return false;
  }

  const privilegesSection = user.privileges[resource];
  if (!privilegesSection || !privilegesSection[withId]) {
    return false;
  }

  return to.every(what => privilegesSection[withId].includes(what))
    ? true
    : false;
};
