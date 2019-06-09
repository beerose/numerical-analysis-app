/** @jsx jsx */
import { jsx } from '@emotion/core';
import { UserDTO } from 'common';
import { useContext } from 'react';

import { LocaleContext } from './locale';
import { Flex } from './Flex';

export type UserInfoProps = Pick<UserDTO, 'user_name' | 'user_role' | 'email'>;
export const UserInfo: React.FC<UserInfoProps> = props => {
  const { texts } = useContext(LocaleContext);

  return (
    <section>
      <Flex paddingBottom={10}>
        <b css={{ paddingRight: 5 }}>{texts.firstNameAndSurname}:</b>{' '}
        {props.user_name}
      </Flex>
      <Flex paddingBottom={10}>
        <b css={{ paddingRight: 5 }}>{texts.email}:</b> {props.email}
      </Flex>
      <Flex paddingBottom={15}>
        <b css={{ paddingRight: 5 }}>{texts.role}:</b> {props.user_role}
      </Flex>
    </section>
  );
};
