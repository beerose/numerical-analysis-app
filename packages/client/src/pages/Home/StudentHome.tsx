import React from 'react';

import { getStudentGroups } from '../../api/userApi';
import { PaddingContainer } from '../../components';
import { usePromise } from '../../utils';
import { AuthStoreState } from '../../AuthStore';

export type StudentHomeProps = AuthStoreState;
export const StudentHome: React.FC<StudentHomeProps> = (
  props: AuthStoreState
) => {
  const studentGroups = usePromise(() => getStudentGroups(props.));

  return (
    <PaddingContainer>
      {JSON.stringify(props)} {JSON.stringify(studentGroups)}
    </PaddingContainer>
  );
};

export default StudentHome;
