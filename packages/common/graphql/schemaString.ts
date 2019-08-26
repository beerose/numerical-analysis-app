import { readFileSync } from 'fs';
import { graphql } from 'graphql';
import { join } from 'path';

export const schemaString = readFileSync(join(__dirname, './schema.graphql'), {
  encoding: 'utf-8',
});
