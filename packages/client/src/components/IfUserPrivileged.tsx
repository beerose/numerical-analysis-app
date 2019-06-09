import { UserPrivileges, UserRole } from 'common';
import React from 'react';

import { useAuthStore } from '../AuthStore';

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
  const user = useAuthStore(state => state.user);

  const fallback =
    typeof otherwise === 'function' ? otherwise() : otherwise || null;
  const renderResult = typeof render === 'function' ? render() : render;

  if (user && user.user_role === UserRole.Admin) {
    return renderResult;
  }

  if (!user || !user.privileges) {
    return fallback;
  }

  const privilegesSection = user.privileges[resource];
  if (!privilegesSection || !privilegesSection[withId]) {
    return fallback;
  }

  return to.every(what => privilegesSection[withId].includes(what))
    ? renderResult
    : fallback;
};
