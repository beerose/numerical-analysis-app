import {
  ApolloServer,
  AuthenticationError,
  Config as ApolloServerBaseConfig,
  gql,
  withFilter,
} from 'apollo-server-express';
import { readFileSync } from 'fs';
import { join } from 'path';

import { resolvers } from './resolvers';

const typeDefs = gql(
  readFileSync(join(__dirname, '../../../common/graphql/schema.graphql'), {
    encoding: 'utf-8',
  })
);

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: ({ req, connection }) => {
    const ctx = connection ? connection.context : req.headers;

    if (!ctx.authorization) {
      console.error('bad headers.authorization', ctx, ctx.authorization);
      throw new AuthenticationError('headers.authorization is required');
    }

    try {
      // TODO: Check JWT Token
      return {
        // SiteConfig.decode(ctx.authorization),
        someData: '???',
      };
    } catch (err) {
      throw new AuthenticationError(
        `headers.authorization is incorrect \n${err.message}`
      );
    }
  },
  // Enable GraphQL Playground in production.
  // We don't believe in security by obscurity.
  introspection: true,
  // playground: true,
});
