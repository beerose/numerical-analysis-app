import { apiMessages } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../lib/request';
import { db } from '../store';

const DeleteUserBodyV = t.type({
  id: t.number,
});

type DeleteUserRequest = GetRequest<typeof DeleteUserBodyV>;

export const deleteUser = (req: DeleteUserRequest, res: Response) => {
  handleBadRequest(DeleteUserBodyV, req.body, res).then(() => {
    db.deleteUser({ id: req.body.id }, (error, results) => {
      if (error) {
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }
      if (!results.affectedRows) {
        return res
          .status(codes.NOT_FOUND)
          .send({ error: apiMessages.userNotFound });
      }
      return res.status(codes.OK).send({ message: apiMessages.userDeleted });
    });
  });
};
