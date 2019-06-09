import { UserDTO } from 'common';
import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';

import { getUser } from '../../api/userApi';
import {
  Breadcrumbs,
  LocaleContext,
  NotFoundPage,
  PaddingContainer,
  Spacer,
  UserInfo,
} from '../../components';
import { usePromise } from '../../utils';

export type UserDetailsPageProps = RouteComponentProps<{ id: string }>;
export const UserDetailsPage: React.FC<UserDetailsPageProps> = ({
  match: {
    params: { id: paramsId },
  },
}) => {
  const { texts } = useContext(LocaleContext);
  const response = usePromise(() => getUser(Number(paramsId)), null, [
    paramsId,
  ]);

  if (!response) {
    return null;
  }

  if (response.status === 404) {
    return (
      <NotFoundPage>
        {texts.userNotFound}
        <Spacer height={100} />
      </NotFoundPage>
    );
  }

  if ('error' in response) {
    throw response;
  }

  return (
    <PaddingContainer>
      <Breadcrumbs />
      <UserInfo {...response.data} />
    </PaddingContainer>
  );
};

export default UserDetailsPage;
