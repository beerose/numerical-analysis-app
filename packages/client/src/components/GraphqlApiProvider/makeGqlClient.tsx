import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import * as ApolloLinkError from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

export const makeGqlClient = (
  uri: string,
  authorizationToken: string,
  onError?: (error: Error) => void
) => {
  const errorLink = ApolloLinkError.onError(
    ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) {
        console.error(
          `[Network error]: ${networkError.message ||
            JSON.stringify(networkError)}`
        );
      }

      const error = graphQLErrors ? graphQLErrors[0] : networkError;
      if (onError && error) {
        onError(error);
      }
    }
  );

  const httpAuthLink = setContext((_, prevContext) => ({
    headers: {
      ...prevContext.headers,
      authorization: authorizationToken,
    },
  }));

  const httpLink = new HttpLink({
    uri,
    credentials:
      process.env.NODE_ENV === 'development' ? 'same-origin' : 'include',
  });

  const wsLink = new WebSocketLink({
    options: {
      connectionParams: {
        authorization: authorizationToken,
      },
      reconnect: true,
    },
    uri: uri.replace(/^http/, 'ws'),
  });

  const finalLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    ApolloLink.from([httpAuthLink, httpLink])
  );

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, finalLink]),
  });
};
