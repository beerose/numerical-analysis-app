import React from 'react';

import { getStudentGroups } from '../../api/userApi';
import { PaddingContainer } from '../../components';
import { usePromise } from '../../utils';
import { AuthStoreState } from '../../AuthStore';

export type StudentHomeProps = AuthStoreState;
export const StudentHome: React.FC<StudentHomeProps> = (
  props: AuthStoreState
) => {
  const result = usePromise(
    () => getStudentGroups(props.user!.id),
    { error: null },
    [props.user!.id]
  );

  if ('error' in result) {
    throw result.error;
  }

  return (
    <PaddingContainer>
      {JSON.stringify(props)} {JSON.stringify(result.groups)}
    </PaddingContainer>
  );
};

export default StudentHome;
