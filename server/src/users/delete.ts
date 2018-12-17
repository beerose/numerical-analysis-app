import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';
import { db } from '../store';

interface DeleteUserRequest extends Request {
  body: { id: string };
}
export const deleteUser = (req: DeleteUserRequest, res: Response) => {
  db.deleteUser({ id: req.body.id }, (error, results) => {
    if (error) {
      return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    if (!results.affectedRows) {
      return res.status(codes.NOT_FOUND).send({ error: apiMessages.userNotFound });
    }
    return res.status(codes.OK).send({ message: apiMessages.userDeleted });
  });
};
