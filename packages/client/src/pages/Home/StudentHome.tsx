/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';

import { PaddingContainer } from '../../components';
import { StudentGroupsList } from '../../components/StudentGroupsList';
import { AuthStoreState } from '../../AuthStore';

export type StudentHomeProps = AuthStoreState;
export const StudentHome: React.FC<StudentHomeProps> = (
  props: AuthStoreState
) => {
  return (
    <PaddingContainer>
      <StudentGroupsList user={props.user!} />
    </PaddingContainer>
  );
};

export default StudentHome;
