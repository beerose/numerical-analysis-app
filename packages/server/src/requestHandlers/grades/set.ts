import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { db } from '../../store';

const SetTaskGradeBodyV = t.type({
  points: t.number,
  task_id: t.number,
  user_id: t.number,
});

type SetTaskPointsRequest = PostRequest<typeof SetTaskGradeBodyV>;

export const setTaskPoints = (
  req: SetTaskPointsRequest,
  res: BackendResponse
) => {
  handleBadRequest(SetTaskGradeBodyV, req.body, res).then(() => {
    const { task_id: taskId, user_id: userId, points } = req.body;
    return db.setTaskPoints({ userId, taskId, points }, err => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }
      return res.status(codes.OK).send({ message: apiMessages.gradeSet });
    });
  });
};
