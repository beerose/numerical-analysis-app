import { apiMessages, UserWithGroups } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';

import { BackendResponse } from '../../../lib';
import { db } from '../../../store';

export const listStudentsWithGroups = (
  _: Request,
  res: BackendResponse<{ students: UserWithGroups[] }>
) => {
  return db.listUsersWithGroup((err, students) => {
    if (err) {
      return res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError, error_details: err.message });
    }
    return res.status(codes.OK).send({
      students: students.map(s => ({
        ...s,
        group_ids: s.group_ids ? s.group_ids.split(',').map(Number) : [],
      })),
    });
  });
};
