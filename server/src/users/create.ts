import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection, DUPLICATE_ENTRY_ERROR } from '../store/connection';
import { addUserQuery } from '../store/queries';

interface AddUserRequest extends Request {
  body: UserDTO;
}
export const create = (req: AddUserRequest, res: Response) => {
  const user = req.body;
  return connection.query(
    {
      sql: addUserQuery,
      values: [user.user_name, user.email, user.user_role, user.student_index],
    },
    error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY_ERROR:
            return res.status(codes.CONFLICT).send({
              error: apiMessages.userAlreadyExists,
            });
          default:
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(codes.OK).send({ message: apiMessages.userCreated });
    }
  );
};
