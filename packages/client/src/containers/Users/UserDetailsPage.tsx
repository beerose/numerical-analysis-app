import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Breadcrumbs, PaddingContainer } from '../../components';

export type UserDetailsPageProps = RouteComponentProps<{ id: string }>;
export const UserDetailsPage: React.FC<UserDetailsPageProps> = props => {
  return (
    <PaddingContainer>
      <Breadcrumbs />
      TODO:
      {props.match.params.id}
    </PaddingContainer>
  );
};

export default UserDetailsPage;
