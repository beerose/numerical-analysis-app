import { apiMessages, TaskDTO } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { GetRequest, handleBadRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const GetTaskQueryV = t.type({
  group_id: t.string,
  task_id: t.string,
});

type GetTaskRequest = GetRequest<typeof GetTaskQueryV>;

export const getTask = (
  req: GetTaskRequest,
  res: BackendResponse<{ task: TaskDTO }>
) => {
  handleBadRequest(GetTaskQueryV, req.query, res).then(() => {
    return db.getTask(
      {
        groupId: Number(req.query.group_id),
        taskId: Number(req.query.task_id),
      },
      (err, task) => {
        if (err) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }
        if (task === null) {
          return res.status(codes.NOT_FOUND).send({
            error: apiMessages.taskNotFound,
          });
        }
        return res.status(codes.OK).send({ task });
      }
    );
  });
};
