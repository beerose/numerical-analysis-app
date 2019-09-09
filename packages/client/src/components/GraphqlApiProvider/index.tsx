import { ApolloProvider } from '@apollo/react-common';
import { Spin } from 'antd';
import React from 'react';

import { SERVER_URL } from '../../api';
import { useAuthStore } from '../../AuthStore';
import { Flex } from '../Flex';

import { makeGqlClient } from './makeGqlClient';

let gqlClient: ReturnType<typeof makeGqlClient>;

type GraphqlApiProviderProps = {};
export const GraphqlApiProvider: React.FC<GraphqlApiProviderProps> = ({
  children,
}) => {
  const token = useAuthStore(s => s.token);

  if (!token) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Spin />
      </Flex>
    );
  }

  gqlClient =
    gqlClient || makeGqlClient(`${SERVER_URL}/graphql`, `Bearer ${token}`);

  return <ApolloProvider client={gqlClient}>{children}</ApolloProvider>;
};
