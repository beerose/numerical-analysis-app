import { apiMessages, TaskKind } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { isNumber } from 'util';

import { BackendResponse, handleBadRequest, PostRequest } from '../../../lib';
import { db } from '../../../store';

const CreateTaskBodyV = t.type({
  group_id: t.number,

  // tslint:disable-next-line:object-literal-sort-keys
  end_upload_date: t.union([t.string, t.undefined]),
  end_vote_date: t.union([t.string, t.undefined]),
  kind: t.union([
    t.literal(TaskKind.Assignment),
    t.literal(TaskKind.Homework),
    t.literal(TaskKind.Exam),
    t.literal(TaskKind.Retake),
    t.literal(TaskKind.Test),
  ]),
  max_points: t.number,
  name: t.string,
  results_date: t.union([t.string, t.undefined]),
  start_upload_date: t.union([t.string, t.undefined]),
  start_vote_date: t.union([t.string, t.undefined]),
  verify_upload: t.boolean,
  weight: t.number,
});

type CreateTaskRequest = PostRequest<typeof CreateTaskBodyV>;

export const createTask = (
  req: CreateTaskRequest,
  res: BackendResponse<{ task_id: number }>
) => {
  handleBadRequest(CreateTaskBodyV, req.body, res).then(() => {
    const task = req.body;
    db.insertTask(
      {
        ...task,
        end_upload_date: task.end_upload_date && new Date(task.end_upload_date),
        end_vote_date: task.end_vote_date && new Date(task.end_vote_date),
        max_points: isNumber(task.max_points) ? Number(task.max_points) : 0,
        results_date: task.results_date
          ? new Date(task.results_date)
          : task.end_upload_date && new Date(task.end_upload_date),
        start_upload_date:
          task.start_upload_date && new Date(task.start_upload_date),
        start_vote_date: task.start_vote_date && new Date(task.start_vote_date),
      },
      (err, result) => {
        if (err) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
          return;
        }
        db.attachTaskToGroup(
          {
            groupId: task.group_id,
            taskId: result.insertId,
            weight: isNumber(task.weight) ? Number(task.weight) : 0,
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
              task_id: result.insertId,
            });
          }
        );
      }
    );
  });
};
