import { UserPrivileges } from 'common';
import React from 'react';
import getState from 'zustand';

import { authStore } from '../AuthStore';

type IfUserPrivilegedProps = {
  to: UserPrivileges.What[];
  in: UserPrivileges.Where;
  withId: number;
  render: React.ReactNode;
  otherwise?: React.ReactNode;
};

export const IfUserPrivileged = (props: IfUserPrivilegedProps) => {
  const user = authStore.getState().user;
  const fallback = props.otherwise ? props.otherwise : false;

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

// <IfUserPrivileged
//  to="edit"
//  groupId={groupId}
//  render={() => <EditGroupForm />}
//  otherwise={() => <Thingy disabled />}
/// >;
