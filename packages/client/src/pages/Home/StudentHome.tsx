/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext } from 'react';

import {
  Heading,
  LocaleContext,
  PaddingContainer,
  Text,
} from '../../components';
import { StudentGroupsList } from '../../components/StudentGroupsList';
import { StudentTasksTable } from '../../components/StudentTasksTable';
import { firstWord } from '../../utils/firstWord';
import { AuthStoreState } from '../../AuthStore';

export type StudentHomeProps = AuthStoreState;
export const StudentHome: React.FC<StudentHomeProps> = (
  props: AuthStoreState
) => {
  const { texts } = useContext(LocaleContext);
  const user = props.user!;

  console.assert(user);

  return (
    <PaddingContainer>
      <Text type="secondary" css={{ display: 'block', paddingBottom: 10 }}>
        {texts.hello} {firstWord(user.user_name)}
      </Text>
      <StudentGroupsList user={user} />
      <Heading>{texts.yourTasks}</Heading>
      <StudentTasksTable />
    </PaddingContainer>
  );
};

export default StudentHome;
