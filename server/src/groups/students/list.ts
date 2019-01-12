import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../../lib/request';
import { connection } from '../../store/connection';
import { listStudentsForGroupQuery } from '../../store/queries';

const ListStudentsForGroupQueryV = t.type({
  group_id: t.string,
});

type ListStudentsForGroupRequest = GetRequest<
  typeof ListStudentsForGroupQueryV
>;

export const listStudentsForGroup = (
  req: ListStudentsForGroupRequest,
  res: Response
) => {
  handleBadRequest(ListStudentsForGroupQueryV, req.query, res).then(() => {
    return connection.query(
      {
        sql: listStudentsForGroupQuery,
        values: [req.query.group_id],
      },
      (err, students) => {
        if (err) {
          console.log(err);
          return res
            .status(codes.INTERNAL_SERVER_ERROR)
            .send({ error: apiMessages.internalError });
        }
        return res.status(codes.OK).send({ students });
      }
    );
  });
};
