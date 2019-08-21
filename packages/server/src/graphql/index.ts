import {
  ApolloServer,
  AuthenticationError,
  Config as ApolloServerBaseConfig,
  gql,
  withFilter,
} from 'apollo-server-express';
import { UserRole } from 'common';
import { flow, identity } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { readFileSync } from 'fs';
import { join } from 'path';

import { authorizeWithToken } from '../middleware/auth/authorize';

import { Context } from './context';
import { resolvers } from './resolvers';

const typeDefs = gql(
  readFileSync(join(__dirname, '../../../common/graphql/schema.graphql'), {
    encoding: 'utf-8',
  })
);

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: async ({ req, connection }): Promise<Context> => {
    const { authorization } = connection ? connection.context : req.headers;

    const user = await authorizeWithToken(authorization, UserRole.All)().then(
      flow(
        fold(err => {
          throw new AuthenticationError(err.error);
        }, identity)
      )
    );

    return { user };
  },
  // Enable GraphQL Playground in production.
  // We don't believe in security by obscurity.
  introspection: true,
  // playground: true,
});
