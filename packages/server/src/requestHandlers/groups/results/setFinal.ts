import { apiMessages } from 'common';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';

import { BackendResponse, handleBadRequest, PostRequest } from '../../../lib';
import { db } from '../../../store';

const SetFinalGradeBodyV = t.type({
  grade: t.number,
  group_id: t.number,
  user_id: t.number,
});

type SetFinalGradeRequest = PostRequest<typeof SetFinalGradeBodyV>;

export const setFinalGrade = (
  req: SetFinalGradeRequest,
  res: BackendResponse
) => {
  handleBadRequest(SetFinalGradeBodyV, req.body, res).then(() => {
    const { group_id: groupId, user_id: userId, grade } = req.body;
    return db.setFinalGrade({ userId, groupId, grade }, err => {
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
