import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { connection } from '../../store/connection';
import { listStudentsForGroupQuery } from '../../store/queries';

interface ListStudentsForGroupRequest extends Request {
  query: {
    group_id: string;
  };
}
export const listStudentsForGroup = (
  req: ListStudentsForGroupRequest,
  res: Response
) => {
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
};
