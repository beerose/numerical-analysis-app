import { apiMessages, Grade } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { db } from '../../store';

const GetGradesQueryV = t.type({
  task_id: t.number,
});

type GetGradesRequest = PostRequest<typeof GetGradesQueryV>;

export const GetGrades = (
  req: GetGradesRequest,
  res: BackendResponse<{ grades: Grade[] }>
) => {
  handleBadRequest(GetGradesQueryV, req.body, res).then(() => {
    const { task_id: taskId } = req.body;
    return db.getGrades({ taskId }, (err, grades) => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }
      return res.status(codes.OK).send({ grades });
    });
  });
};
