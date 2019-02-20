import { apiMessages, TaskKind } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { handleBadRequest, PostRequest } from '../../lib/request';
import { BackendResponse } from '../../lib/response';
import { db } from '../../store';

const CreateTaskBodyV = t.type({
  group_id: t.number,

  // tslint:disable-next-line:object-literal-sort-keys
  end_upload_date: t.string,
  kind: t.union([t.literal(TaskKind.Assignment), t.literal(TaskKind.Homework)]),
  max_points: t.number,
  name: t.string,
  results_date: t.union([t.string, t.undefined]),
  start_upload_date: t.string,
  verify_upload: t.boolean,
  weight: t.number,
});

type CreateTaskRequest = PostRequest<typeof CreateTaskBodyV>;

export const createTask = (req: CreateTaskRequest, res: BackendResponse) => {
  handleBadRequest(CreateTaskBodyV, req.body, res).then(() => {
    const task = req.body;
    db.insertTask(
      {
        ...task,
        end_upload_date: new Date(task.end_upload_date),
        results_date: new Date(
          task.results_date ? task.results_date : task.end_upload_date
        ),
        start_upload_date: new Date(task.start_upload_date),
      },
      (err, result) => {
        if (err) {
          res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }
        db.attachTaskToGroup(
          {
            groupId: task.group_id,
            taskId: result.insertId,
            weight: task.weight,
          },
          attachErr => {
            if (attachErr) {
              res.status(codes.INTERNAL_SERVER_ERROR).send({
                error: apiMessages.internalError,
                error_details: attachErr.message,
              });
            }
            res.status(codes.OK).send({ message: apiMessages.taskCreated });
          }
        );
      }
    );
  });
};
