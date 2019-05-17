import React, { useContext } from 'react';

import { AuthContext } from '../AuthContext';

type LogoutProps = {};
export const Logout: React.FC<LogoutProps> = () => {
  const { actions } = useContext(AuthContext);
  actions.logoutUser();
  return null;
};
