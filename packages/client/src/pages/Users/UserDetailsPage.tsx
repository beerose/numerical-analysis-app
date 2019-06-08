import { UserDTO } from 'common';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { getUser } from '../../api/userApi';
import { Breadcrumbs, NotFoundPage, PaddingContainer } from '../../components';
import { usePromise } from '../../utils';

const USER_NOT_FOUND = Symbol('USER_NOT_FOUND');

export type UserDetailsPageProps = RouteComponentProps<{ id: string }>;
export const UserDetailsPage: React.FC<UserDetailsPageProps> = ({
  match: {
    params: { id: paramsId },
  },
}) => {
  const user = usePromise(
    (): Promise<UserDTO | typeof USER_NOT_FOUND> => {
      const userId = Number(paramsId);
      if (!isNaN(userId)) {
        return getUser(userId);
      }
      return Promise.resolve(USER_NOT_FOUND);
    },
    null,
    [paramsId]
  );

  if (!user) {
    return null;
  }

  if (user === USER_NOT_FOUND) {
    return (
      <PaddingContainer>
        <NotFoundPage>User not found 🔍</NotFoundPage>
      </PaddingContainer>
    );
  }

  return (
    <PaddingContainer>
      <Breadcrumbs />
    </PaddingContainer>
  );
};

export default UserDetailsPage;
