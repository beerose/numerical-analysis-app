import { apiMessages, StudentTasksSummary } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

import { BackendResponse, GetRequest, handleBadRequest } from '../../../lib';
import { db } from '../../../store';

const GetStudentTasksV = t.type({
  params: t.type({
    id: NumberFromString,
  }),
  query: t.partial({
    groupId: NumberFromString,
  }),
});

type GetStudentTasks = GetRequest<typeof GetStudentTasksV>;

type StudentTasksResponse = {
  tasksSummary: StudentTasksSummary;
};

export const tasksSummary = (
  req: Request,
  res: BackendResponse<StudentTasksResponse>
) => {
  handleBadRequest(
    GetStudentTasksV,
    { query: req.query, params: req.params },
    res
  ).then(req => {
    return db.getStudentsTasks(
      { userId: req.params.id, groupId: req.query.groupId },
      (dbErr, dbRes) => {
        if (dbErr) {
          return res.internalError(dbErr);
        }

        return res.status(codes.OK).send({
          tasksSummary: dbRes,
        });
      }
    );
  });
};
