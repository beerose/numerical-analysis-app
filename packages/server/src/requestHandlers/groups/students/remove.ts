import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../../lib';
import { db } from '../../../store';

const RemoveStudentFromGroupBodyV = t.type({
  group_id: t.number,
  user_id: t.number,
});

type RemoveStudentFromGroupRequest = PostRequest<
  typeof RemoveStudentFromGroupBodyV
>;

export const removeStudentFromGroup = (
  req: RemoveStudentFromGroupRequest,
  res: BackendResponse
) => {
  handleBadRequest(RemoveStudentFromGroupBodyV, req.body, res).then(() => {
    const { user_id, group_id } = req.body;
    db.removeStudentFromGroup({ userId: user_id, groupId: group_id }, err => {
      if (err) {
        res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
        return;
      }
      res.status(codes.OK).send({ message: apiMessages.userRemovedFromGroup });
    });
  });
};
