import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import { prepareCountUsersQuery, prepareListUsersQuery } from '../store/queries';

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
  const listUsersQuery = prepareListUsersQuery(search_param, roles);
  const countUsersQuery = prepareCountUsersQuery(search_param, roles);

  const parsedLimit = limit ? parseInt(limit, 10) : 10;
  const parsedOffset = offset ? parseInt(offset, 10) : 0;
  return connection.query(
    {
      sql: listUsersQuery,
      values: [parsedLimit, parsedOffset],
    },
    (listErr, users) => {
      if (listErr) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return connection.query(
        {
          sql: countUsersQuery,
          values: [parsedLimit, parsedOffset],
        },
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
