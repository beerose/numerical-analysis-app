import React, { useContext, useEffect } from 'react';

import useRouter from '../utils/useRouter';
import { useAuthStore } from '../AuthStore';

type LogoutProps = {};
export const Logout: React.FC<LogoutProps> = () => {
  const { logout } = useAuthStore(s => s.actions);
  const { history } = useRouter();

  useEffect(() => {
    logout();
    history.push('/');
  }, []);
  return null;
};
