import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from 'common';
import { apiMessages } from 'common';
import { db } from '../store';
import { connection } from '../store/connection';

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
    { roles, searchParam: search_param, limit: parsedLimit, offset: parsedOffset },
    (listErr, users) => {
      if (listErr) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return db.countUsers({ roles, searchParam: search_param }, (countErr, [{ total }]) => {
        if (countErr) {
          return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
        }
        return res.status(codes.OK).send({ users, total });
      });
    }
  );
};
