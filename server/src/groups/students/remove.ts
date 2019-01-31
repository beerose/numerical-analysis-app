import { apiMessages } from 'common';
import { Response } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { db } from '../../store';

const RemoveStudentFromGroupBodyV = t.type({
  group_id: t.number,
  user_id: t.number,
});

type RemoveStudentFromGroupRequest = PostRequest<
  typeof RemoveStudentFromGroupBodyV
>;

export const removeStudentFromGroup = (
  req: RemoveStudentFromGroupRequest,
  res: Response
) => {
  handleBadRequest(RemoveStudentFromGroupBodyV, req.body, res).then(() => {
    const { user_id, group_id } = req.body;
    db.removeStudentFromGroup({ userId: user_id, groupId: group_id }, err => {
      if (err) {
        console.error(err);
        res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.userRemovedFromGroup });
    });
  });
};
