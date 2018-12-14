import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps } from 'react-router';

import { WrappedNewGroupForm } from './components/NewGroupForm';

const Container = styled('div')`
  align-items: center;
  display: flex;
  height: 80vh;
  justify-content: center;
`;

export const CreateGroupContainer = (props: RouteComponentProps) => (
  <Container>
    <WrappedNewGroupForm
      onSubmit={() => props.history.push('ud')}
      onCancel={() => props.history.push('/groups')}
    />
  </Container>
);
