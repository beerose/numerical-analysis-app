import { UserPrivileges } from 'common';
import React from 'react';

import { useAuthStore } from '../AuthStore';

type IfUserPrivilegedProps = {
  to: UserPrivileges.What[];
  in: UserPrivileges.Where;
  withId: number;
  render: React.ReactElement;
  otherwise?: React.ReactElement;
};

export const IfUserPrivileged = (props: IfUserPrivilegedProps) => {
  const user = useAuthStore(state => state.user);

  const fallback = props.otherwise || null;

  if (!user || !user.privileges) {
    return fallback;
  }

  const privilegesSection = user.privileges[props.in];
  if (!privilegesSection || !privilegesSection[props.withId]) {
    return fallback;
  }

  return props.to.every(what => privilegesSection[props.withId].includes(what))
    ? props.render
    : fallback;
};
