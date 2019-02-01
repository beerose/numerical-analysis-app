import { apiMessages, UserDTO } from 'common';
import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { db } from '../store';

interface ListUsersRequest extends Request {
  query: {
    search_param?: string;
    roles?: string | string[];
    limit?: string;
    offset?: string;
  };
}
interface ListUsersResponse extends Response {
  send: (body: { users: UserDTO[]; total: number }) => Response;
}
export const list = (req: ListUsersRequest, res: ListUsersResponse) => {
  const { search_param, roles, offset, limit } = req.query;

  const parsedLimit = limit ? parseInt(limit, 10) : 10;
  const parsedOffset = offset ? parseInt(offset, 10) : 0;
  return db.listUsers(
    {
      roles,
      limit: parsedLimit,
      offset: parsedOffset,
      searchParam: search_param,
    },
    (listErr, users) => {
      if (listErr) {
        return res
          .status(codes.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }
      return db.countUsers(
        { roles, searchParam: search_param },
        (countErr, [{ total }]) => {
          if (countErr) {
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
          }
          return res.status(codes.OK).send({ users, total });
        }
      );
    }
  );
};
