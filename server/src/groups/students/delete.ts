import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from 'common';
import { connection } from '../../store/connection';
import { deleteStudentFromGroupQuery } from '../../store/queries';

interface DeleteUserFromGroupRequest extends Request {
  query: {
    user_id: string;
  };
}
export const deleteUserFromGroup = (
  req: DeleteUserFromGroupRequest,
  res: Response
) => {
  return connection.query(
    {
      sql: deleteStudentFromGroupQuery,
      values: [req.body.user_id],
    },
    err => {
      if (err) {
        console.log(err);
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }
      return res.status(codes.OK).send({ message: apiMessages.userDeleted });
    }
  );
};
