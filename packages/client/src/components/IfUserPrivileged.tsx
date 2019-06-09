import { UserPrivileges, UserRole } from 'common';
import React from 'react';

import { isUserPrivileged } from '../utils/isUserPrivileged';

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
