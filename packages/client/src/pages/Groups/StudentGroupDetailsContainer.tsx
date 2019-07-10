import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';

import {
  Heading,
  LocaleContext,
  PaddingContainer,
  StudentTasksTable,
} from '../../components';
import { isNumber } from '../../utils';

export type StudentGroupDetailsContainerProps = RouteComponentProps<{
  id: string;
}>;

export const StudentGroupDetailsContainer: React.FC<
  StudentGroupDetailsContainerProps
> = ({ match: { params } }) => {
  const { texts } = useContext(LocaleContext);

  console.assert(params.id && isNumber(params.id));

  return (
    <PaddingContainer>
      <Heading>{texts.tasks}</Heading>
      <StudentTasksTable groupId={Number(params.id)} />
    </PaddingContainer>
  );
};
