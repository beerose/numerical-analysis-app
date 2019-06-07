import { apiMessages, GroupDTO, isUserId } from 'common';
import * as codes from 'http-status-codes';

import { BackendResponse, GetRequest } from '../../../lib';
import { db } from '../../../store';

type GetStudentGroups = GetRequest<any>;

export const groups = (
  req: GetStudentGroups,
  res: BackendResponse<{ groups: GroupDTO[] }>
) => {
  const userId = parseInt(req.params.id, 10);
  if (!isUserId(userId)) {
    return res.status(codes.BAD_REQUEST).send({
      error: apiMessages.invalidRequest,
      error_details: 'Expected path matching /users/:id/student.groups',
    });
  }

  return db.getStudentGroups({ userId }, (dbErr, dbRes) => {
    if (dbErr) {
      return res.status(codes.INTERNAL_SERVER_ERROR).send({
        error: apiMessages.internalError,
        error_details: dbErr.message,
      });
    }

    return res.status(codes.OK).send({
      groups: dbRes,
    });
  });
};
