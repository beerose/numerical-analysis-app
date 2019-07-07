/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext } from 'react';

import { LocaleContext, PaddingContainer, Text } from '../../components';
import { StudentGroupsList } from '../../components/StudentGroupsList';
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
    </PaddingContainer>
  );
};

export default StudentHome;
