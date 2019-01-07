import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from 'common';
import { apiMessages } from 'common';
import { db } from '../store';
import { DUPLICATE_ENTRY_ERROR } from '../store/connection';

interface UpdateUserRequest extends Request {
  body: UserDTO;
}
export const update = (req: UpdateUserRequest, res: Response) => {
  const user = req.body;
  db.updateUser(user, error => {
    if (error) {
      switch (error.code) {
        case DUPLICATE_ENTRY_ERROR:
          return res.status(codes.CONFLICT).send({ error: apiMessages.userAlreadyExists });
        default:
          return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
    }
    return res.status(codes.OK).send({ message: apiMessages.userUpdated });
  });
};
