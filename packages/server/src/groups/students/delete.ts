import { apiMessages } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { db } from '../../store';

interface DeleteUserFromGroupRequest extends Request {
  query: {
    user_id: number;
    group_id: number;
  };
}
export const deleteUserFromGroup = (
  req: DeleteUserFromGroupRequest,
  res: Response
) => {
  return db.deleteFromGroup(
    { userId: req.body.user_id, groupId: req.body.group_id },
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
