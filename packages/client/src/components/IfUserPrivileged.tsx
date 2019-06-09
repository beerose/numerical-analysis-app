import { UserPrivileges, UserRole } from 'common';
import React from 'react';

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

type IfUserPrivilegedProps = {
  to: UserPrivileges.What[];
  in: UserPrivileges.Where;
  withId: number;
  render: JSX.Element | (() => JSX.Element);
  otherwise?: JSX.Element | (() => JSX.Element);
};

export const IfUserPrivileged: React.FC<IfUserPrivilegedProps> = ({
  render,
  otherwise,
  withId,
  in: resource,
  to,
}) => {
  const fallback =
    typeof otherwise === 'function' ? otherwise() : otherwise || null;
  const renderResult = typeof render === 'function' ? render() : render;

  return isUserPrivileged(to, resource, withId) ? renderResult : fallback;
};
