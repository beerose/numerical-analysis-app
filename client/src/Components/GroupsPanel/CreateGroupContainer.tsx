import * as React from 'react';
import styled from 'react-emotion';

import { WrappedNewGroupForm } from './NewGroupForm';

const Container = styled('div')`
  align-items: center;
  display: flex;
  height: 80vh;
  justify-content: center;
`;

export const CreateGroupContainer = () => (
  <Container>
    <WrappedNewGroupForm onSubmit={() => null} onCancel={() => null} />
  </Container>
);
