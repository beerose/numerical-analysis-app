import styled from '@emotion/styled';
import React, { useContext } from 'react';

import { LocaleContext } from '../components/locale';
import { Flex } from '../components/Flex';

const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 1.4em;

  h1 {
    color: #001529;

    font-size: 25vw;
    font-weight: 700;
    margin-bottom: 0.02em;

    user-select: none;
  }
`;

type NotFoundPageProps = {
  children?: React.ReactNode;
};

export const NotFoundPage = (props: NotFoundPageProps) => {
  const { texts } = useContext(LocaleContext);

  const children = props.children || <p>{texts.couldntFindPage}</p>;

  return (
    <Container flex={1}>
      <h1>404</h1>
      {children}
    </Container>
  );
};
