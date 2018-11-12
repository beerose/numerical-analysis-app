import * as React from 'react';
import styled from 'react-emotion';

import { RouterConsumer } from '../../RouterContext';

import { WrappedNewGroupForm } from './NewGroupForm';

const Container = styled('div')`
  align-items: center;
  display: flex;
  height: 80vh;
  justify-content: center;
`;

export const CreateGroupContainer = () => (
  <RouterConsumer>
    {({ routerActions }) => (
      <Container>
        <WrappedNewGroupForm
          onSubmit={() => routerActions.goToGroup}
          onCancel={routerActions.goToGroupsPage}
        />
      </Container>
    )}
  </RouterConsumer>
);
