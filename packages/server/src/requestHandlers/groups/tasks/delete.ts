import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const DeleteTaskBodyV = t.type({
  group_id: t.number,
  task_id: t.number,
});

type DeleteTaskRequest = PostRequest<typeof DeleteTaskBodyV>;

export const deleteTaskFromGroup = (
  req: DeleteTaskRequest,
  res: BackendResponse
) => {
  handleBadRequest(DeleteTaskBodyV, req.body, res).then(() => {
    const { task_id: taskId, group_id: groupId } = req.body;
    return db.deleteTaskFromGroup({ groupId, taskId }, err => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }
      return res.status(codes.OK).send({ message: apiMessages.taskDeleted });
    });
  });
};
