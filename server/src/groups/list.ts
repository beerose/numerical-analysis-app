import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { connection } from '../store/connection';
import { listGroupsQuery } from '../store/queries';

export const list = (_req: Request, res: Response) => {
  return connection.query(
    {
      sql: listGroupsQuery,
    },
    (err, groups) => {
      if (err) {
        console.log(err);
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }
      return res.status(codes.OK).send({ groups });
    }
  );
};
