import atob from 'atob';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import { Base64 } from 'js-base64';

import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { upsertUserQuery } from '../store/queries';

import { readCSV } from './uploadUtils';

interface UploadRequest extends Request {
  body: { data: string; group: string };
}
export const upload = (req: UploadRequest, res: Response) => {
  // const decodesdData = Base64.atob(req.body.data);
  console.log(req.body.data);
  const { users, isValid } = readCSV(req.body.data);
  if (!isValid) {
    return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidCSV });
  }
  if (!users || !users.length) {
    return res.status(codes.PRECONDITION_FAILED).send({ error: apiMessages.emptyCSV });
  }

  const userRows = users.map(user => [
    user.user_name,
    user.email,
    user.user_role,
    user.student_index,
    req.body.group,
  ]);
  return connection.beginTransaction(beginError => {
    if (beginError) {
      return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    return connection.query(
      {
        sql: upsertUserQuery,
        values: [userRows],
      },
      upsertErr => {
        if (upsertErr) {
          return connection.rollback(() => {
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
          });
        }
        connection.commit(commitErr => {
          if (commitErr) {
            return connection.rollback(() => {
              return res
                .status(codes.INTERNAL_SERVER_ERROR)
                .send({ error: apiMessages.internalError });
            });
          }
          return res.status(codes.OK).send({ message: users });
        });
      }
    );
  });
};
