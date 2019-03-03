import { apiMessages, TaskKind } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { isNumber } from 'util';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const UpdateTaskBodyV = t.type({
  group_id: t.number,

  // tslint:disable-next-line:object-literal-sort-keys
  end_upload_date: t.string,
  id: t.number,
  kind: t.union([t.literal(TaskKind.Assignment), t.literal(TaskKind.Homework)]),
  max_points: t.number,
  name: t.string,
  results_date: t.union([t.string, t.undefined]),
  start_upload_date: t.string,
  verify_upload: t.boolean,
  weight: t.number,
});

type UpdateTaskRequest = PostRequest<typeof UpdateTaskBodyV>;

export const updateTask = (
  req: UpdateTaskRequest,
  res: BackendResponse<{ task_id: number }>
) => {
  handleBadRequest(UpdateTaskBodyV, req.body, res).then(() => {
    const task = req.body;
    db.updateTask(
      {
        ...task,
        end_upload_date: new Date(task.end_upload_date),
        max_points: isNumber(task.max_points) ? Number(task.max_points) : 0,
        results_date: new Date(
          task.results_date ? task.results_date : task.end_upload_date
        ),
        start_upload_date: new Date(task.start_upload_date),
      },
      err => {
        if (err) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
          return;
        }
        db.updateTaskInGroup(
          {
            groupId: task.group_id,
            taskId: task.id,
            weight: isNumber(task.weight) ? Number(task.weight) : 0,
          },
          updateWeightErr => {
            if (updateWeightErr) {
              res.status(codes.INTERNAL_SERVER_ERROR).send({
                error: apiMessages.internalError,
                error_details: updateWeightErr.message,
              });
            }
            res.status(codes.OK).send({
              message: apiMessages.taskUpdated,
            });
          }
        );
      }
    );
  });
};
