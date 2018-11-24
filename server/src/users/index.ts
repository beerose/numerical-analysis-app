import { Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import {
  addUserQuery,
  deleteUserQuery,
  prepareCountUsersQuery,
  prepareListUsersQuery,
  updateUserQuery,
} from '../store/queries';

const DUPLICATE_ENTRY = 'ER_DUP_ENTRY';

interface AddUserRequest extends Request {
  body: UserDTO;
}
export const add = (req: AddUserRequest, res: Response) => {
  const user = req.body;
  return connection.query(
    {
      sql: addUserQuery,
      values: [user.user_name, user.email, user.user_role, user.student_index],
    },
    error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY:
            return res.status(codes.CONFLICT).send({
              error: apiMessages.userAlreadyExists,
            });
          default:
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(codes.OK).send({ message: apiMessages.userCreated });
    }
  );
};

interface UpdateUserRequest extends Request {
  body: UserDTO;
}
export const update = (req: UpdateUserRequest, res: Response) => {
  const user = req.body;
  return connection.query(
    {
      sql: updateUserQuery,
      values: [user.email, user.user_name, user.user_role, user.student_index, user.id],
    },
    error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY:
            return res.status(codes.CONFLICT).send({ error: apiMessages.userAlreadyExists });
          default:
            return res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(codes.OK).send({ message: apiMessages.userUpdated });
    }
  );
};

interface DeleteUserRequest extends Request {
  body: { id: string };
}
export const deleteUser = (req: DeleteUserRequest, res: Response) => {
  return connection.query(
    {
      sql: deleteUserQuery,
      values: [req.body.id],
    },
    (error, results) => {
      if (error) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      if (!results.affectedRows) {
        return res.status(codes.NOT_FOUND).send({ error: apiMessages.userNotFound });
      }
      return res.status(codes.OK).send({ message: apiMessages.userDeleted });
    }
  );
};

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
  console.log(req.cookies);
  const { search_param, roles, offset, limit } = req.query;
  const listUsersQuery = prepareListUsersQuery(search_param, roles);
  const countUsersQuery = prepareCountUsersQuery(search_param, roles);
  return connection.query(
    {
      sql: listUsersQuery,
      values: [limit ? parseInt(limit, 10) : 10, offset ? parseInt(offset, 10) : 0],
    },
    (listErr, users) => {
      if (listErr) {
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return connection.query(
        {
          sql: countUsersQuery,
          values: [limit ? parseInt(limit, 10) : 10, offset ? parseInt(offset, 10) : 0],
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
