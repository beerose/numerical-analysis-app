import { UserId, userIdRuntimeType } from 'common';
import { pipe } from 'fp-ts/lib/pipeable';
import * as Task from 'fp-ts/lib/Task';
import * as t from 'io-ts';
import { QueryOptions, sql } from 'tag-sql';
import { Primitive } from 'utility-types';

import { connection } from '../connection';
import { QueryCallback } from './QueryCallback';

interface JsonArray extends Array<Json> {}
interface JsonObject extends Record<string | number, Json> {}
type Json = null | Primitive | JsonArray | JsonObject;

type FileMeta = {
  filepath: string;
  uploaded_by: UserId;
  meta: Json;
};

namespace FileMeta {
  export const runtimeType: t.Type<FileMeta> = t.type({
    filepath: t.string,
    uploaded_by: userIdRuntimeType,
    meta: t.UnknownRecord as t.Type<Json>,
  });
}

function makeQuery<A, P extends any[]>(
  decoder: t.Decoder<unknown, A>,
  f: (...args: P) => QueryOptions
) {
  return (...args: P) =>
    pipe(
      Task.of(
        () =>
          new Promise((resolve: QueryCallback<A>) =>
            connection.query(f(...args), resolve)
          )
      ),
      Task.map(decoder.decode)
    );
}

const getFileMeta = makeQuery(
  t.array(FileMeta.runtimeType),
  (filepath: string) => sql`

  `
);
