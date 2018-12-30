import styled from '@emotion/styled';
import React from 'react';

import { Flex } from './Flex';

const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 1.4em;

  h1 {
    color: #001529;

    font-size: 25vw;
    font-weight: 700;
    margin-bottom: 0.1em;
  }
`;

const Spacer = (props: React.CSSProperties) => <div style={props} />; // 🙊🌌🛰

type NotFoundPageProps = {
  children?: React.ReactNode;
};

export const NotFoundPage = ({ children }: NotFoundPageProps) => (
  <Container flex={1}>
    <h1>404</h1>
    {children}
    <Spacer height={100} />
  </Container>
);

NotFoundPage.defaultProps = {
  children: <p>Nie mogliśmy znaleźć strony, której szukasz 😔</p>,
};
