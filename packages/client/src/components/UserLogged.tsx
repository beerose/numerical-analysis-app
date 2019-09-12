import React, { useEffect } from 'react';

import { Home } from '../pages';
import { showMessage } from '../utils';

export const UserLogged = () => {
  useEffect(() => {
    showMessage({ warning: 'Jesteś już zalogowany' }, { duration: 5 });
  }, []);

  return <Home />;
};
