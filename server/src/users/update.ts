import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection, DUPLICATE_ENTRY_ERROR } from '../store/connection';
import { updateUserQuery } from '../store/queries';

interface UpdateUserRequest extends Request {
  body: UserDTO;
}
export const update = (req: UpdateUserRequest, res: Response) => {
  const user = req.body;
  return connection.query(
    {
      sql: updateUserQuery,
      values: [user.email, user.user_name, user.user_role, user.student_index, user.id],
    },
    error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY_ERROR:
            return res.status(codes.CONFLICT).send({ error: apiMessages.userAlreadyExists });
          default:
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(codes.OK).send({ message: apiMessages.userUpdated });
    }
  );
};
