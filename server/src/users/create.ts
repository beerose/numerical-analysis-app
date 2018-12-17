import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { DUPLICATE_ENTRY_ERROR } from '../store/connection';
import * as db from '../store/mysql';

interface AddUserRequest extends Request {
  body: UserDTO;
}
export const create = (req: AddUserRequest, res: Response) => {
  const user = req.body;
  db.addUser(user, error => {
    if (error) {
      switch (error.code) {
        case DUPLICATE_ENTRY_ERROR:
          return res.status(codes.CONFLICT).send({
            error: apiMessages.userAlreadyExists,
          });
        default:
          return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
    }
    return res.status(codes.OK).send({ message: apiMessages.userCreated });
  });
};
