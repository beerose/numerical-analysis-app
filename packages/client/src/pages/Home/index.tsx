import { UserRole } from 'common';
import React from 'react';

import { useAuthStore } from '../../AuthStore';

import { LecturerHome } from './LecturerHome';
import StudentHome from './StudentHome';

export const Home = () => {
  const authStore = useAuthStore(s => s);

  console.assert(authStore.user);

  return authStore.user!.user_role === UserRole.Student ? (
    <StudentHome {...authStore} />
  ) : (
    <LecturerHome {...authStore} />
  );
};
