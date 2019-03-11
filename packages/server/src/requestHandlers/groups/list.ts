import { apiMessages, GroupDTO } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';

import { BackendResponse } from '../../lib';
import { db } from '../../store';

export const list = (
  _req: Request,
  res: BackendResponse<{ groups: GroupDTO[] }>
) => {
  return db.listGroups((err, groups) => {
    if (err) {
      return res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError, error_details: err.message });
    }
    return res.status(codes.OK).send({ groups });
  });
};
