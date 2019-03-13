import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../lib';
import { db } from '../../store';

const AddGradeBodyV = t.type({
  points: t.number,
  task_id: t.number,
  user_id: t.number,
});

type AddGradeRequest = PostRequest<typeof AddGradeBodyV>;

export const addGrade = (req: AddGradeRequest, res: BackendResponse) => {
  handleBadRequest(AddGradeBodyV, req.body, res).then(() => {
    const { task_id: taskId, user_id: userId, points } = req.body;
    return db.addGrade({ userId, taskId, points }, err => {
      if (err) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: err.message,
        });
      }
      return res.status(codes.OK).send({ message: apiMessages.gradeAdded });
    });
  });
};
