import { apiMessages } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';

import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

interface DeleteUserFromGroupRequest extends Request {
  query: {
    user_id: number;
    group_id: number;
  };
}
export const deleteUserFromGroup = (
  req: DeleteUserFromGroupRequest,
  res: BackendResponse
) => {
  return db.deleteFromGroup(
    { userId: req.body.user_id, groupId: req.body.group_id },
    err => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }
      return res.status(codes.OK).send({ message: apiMessages.userDeleted });
    }
  );
};
