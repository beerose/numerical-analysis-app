import React from 'react';

import { PaddingContainer } from '../../components';
import { StudentGroupsList } from '../../components/StudentGroupsList';
import { useAuthStore } from '../../AuthStore';

export type StudentGroupsListContainerProps = {};
export const StudentGroupsListContainer: React.FC<
  StudentGroupsListContainerProps
> = () => {
  const user = useAuthStore(s => s.user)!;

  console.assert(user, 'user must be defined');

  return (
    <PaddingContainer>
      <StudentGroupsList user={user} />
    </PaddingContainer>
  );
};
