import { ApolloServer, AuthenticationError, gql } from 'apollo-server-express';
import { UserRole } from 'common';
import { schemaString } from 'common/graphql/schemaString';
import { flow, identity } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import { authorizeWithToken } from '../middleware/auth/authorize';

import { resolvers } from './resolvers';
import { Context } from './Context';

export const apolloServer = new ApolloServer({
  typeDefs: gql(schemaString),
  resolvers: resolvers as any,
  context: async ({ req, connection }): Promise<Context> => {
    const { authorization, 'x-group-id': groupId } = connection
      ? connection.context
      : req.headers;

    const user = await authorizeWithToken(authorization, UserRole.All)().then(
      flow(
        fold(err => {
          throw new AuthenticationError(err.error);
        }, identity)
      )
    );

    return {
      user,
      groupId,
    };
  },
  // Enable GraphQL Playground in production.
  // We don't believe in security by obscurity.
  introspection: true,
});
