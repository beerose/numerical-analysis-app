import { apiMessages, UserTaskPoints } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { db } from '../../store';

const GetGradesQueryV = t.type({
  group_id: t.string,
  task_id: t.string,
});

type GetGradesRequest = PostRequest<typeof GetGradesQueryV>;

export const GetGrades = (
  req: GetGradesRequest,
  res: BackendResponse<{ grades: UserTaskPoints[] }>
) => {
  handleBadRequest(GetGradesQueryV, req.query, res).then(() => {
    const { task_id, group_id } = req.query;
    return db.getGrades(
      { taskId: Number(task_id), groupId: Number(group_id) },
      (err, grades) => {
        if (err) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: err.message,
          });
        }
        return res.status(codes.OK).send({ grades });
      }
    );
  });
};
