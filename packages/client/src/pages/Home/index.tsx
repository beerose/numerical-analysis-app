import { UserRole } from 'common';
import React from 'react';

import { useAuthStore } from '../../AuthStore';

import { LecturerHome } from './LecturerHome';
import StudentHome from './StudentHome';

export const Home = () => {
  const authStore = useAuthStore();

  return authStore.userRole === UserRole.Student ? (
    <StudentHome {...authStore} />
  ) : (
    <LecturerHome {...authStore} />
  );
};
