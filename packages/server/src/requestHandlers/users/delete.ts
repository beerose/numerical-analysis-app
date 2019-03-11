import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, GetRequest, handleBadRequest } from '../../lib';
import { db } from '../../store';

const DeleteUserBodyV = t.type({
  id: t.number,
});

type DeleteUserRequest = GetRequest<typeof DeleteUserBodyV>;

export const deleteUser = (req: DeleteUserRequest, res: BackendResponse) => {
  handleBadRequest(DeleteUserBodyV, req.body, res).then(() => {
    db.deleteUser({ id: req.body.id }, (err, results) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
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
