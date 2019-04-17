import { apiMessages, TaskKind } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { isNumber } from 'util';

import { BackendResponse, handleBadRequest, PostRequest } from '../../../lib';
import { db } from '../../../store';

const AttachTaskBodyV = t.type({
  group_id: t.number,
  task_id: t.number,
  weight: t.number,
});

type AttachTaskRequest = PostRequest<typeof AttachTaskBodyV>;

export const attachTask = (
  req: AttachTaskRequest,
  res: BackendResponse<{ task_id: number }>
) => {
  handleBadRequest(AttachTaskBodyV, req.body, res).then(() =>
    db.attachTaskToGroup(
      {
        groupId: req.body.group_id,
        taskId: req.body.task_id,
        weight: isNumber(req.body.weight) ? Number(req.body.weight) : 0,
      },
      attachErr => {
        if (attachErr) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: attachErr.message,
          });
          return;
        }
        res.status(codes.OK).send({
          message: apiMessages.taskCreated,
        });
      }
    )
  );
};
