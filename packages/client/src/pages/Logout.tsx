import React, { useEffect } from 'react';

import useRouter from '../utils/useRouter';
import { useAuthStore } from '../AuthStore';

import { useGroupApiContext } from './Groups/GroupApiContext';

type LogoutProps = {};
export const Logout: React.FC<LogoutProps> = () => {
  const groupsCtx = useGroupApiContext();
  const { logout } = useAuthStore(s => s.actions);
  const { history } = useRouter();

  useEffect(() => {
    groupsCtx.actions.resetState();
    logout();
    history.push('/');
  }, []);

  return null;
};
