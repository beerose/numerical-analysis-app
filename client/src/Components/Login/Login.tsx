import * as React from 'react';
import styled from 'react-emotion';

import { WrappedLoginForm } from './LoginForm';

const Container = styled('div')`
  width: 100%;
  height: 40vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
`;

export const LoginPage = ({ visible }: { visible: true }) => (
  <Container>
    <WrappedLoginForm visible={visible} />
  </Container>
);
