import { apiMessages, UserDTO } from 'common';
import { Request } from 'express';
import * as codes from 'http-status-codes';

import { BackendResponse } from '../../lib';
import { db } from '../../store';

interface ListUsersRequest extends Request {
  query: {
    search_param?: string;
    roles?: string | string[];
    limit?: string;
    offset?: string;
  };
}

export const list = (
  req: ListUsersRequest,
  res: BackendResponse<{ users: UserDTO[]; total: number }>
) => {
  const { search_param: searchParam, roles, offset, limit } = req.query;

  const parsedLimit = limit ? parseInt(limit, 10) : 10;
  const parsedOffset = offset ? parseInt(offset, 10) : 0;
  return db.listUsers(
    {
      roles,
      searchParam,
      limit: parsedLimit,
      offset: parsedOffset,
    },
    (listErr, users) => {
      if (listErr) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({
          error: apiMessages.internalError,
          error_details: listErr.message,
        });
      }
      return db.countUsers({ roles, searchParam }, (countErr, [{ total }]) => {
        if (countErr) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({
            error: apiMessages.internalError,
            error_details: countErr.message,
          });
        }
        return res.status(codes.OK).send({ users, total });
      });
    }
  );
};
