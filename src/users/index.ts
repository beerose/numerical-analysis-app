import { Request, Response } from 'express';
import * as HTTPStatus from 'http-status-codes';

import { connection } from '../store/connection';
import { UserModel } from '../store/model';
import {
  addUserQuery,
  deleteUserQuery,
  prepareListUsersQuery,
  updateUserQuery,
} from '../store/queries';

const DUPLICATE_ENTRY = 'ER_DUP_ENTRY';

interface AddUserRequest extends Request {
  body: UserModel;
}
const validateUserRequest = (user: Record<string, any>) =>
  user.user_name && user.email && user.user_role;

export const add = (req: AddUserRequest, res: Response) => {
  const user = req.body;
  if (!validateUserRequest(user)) {
    return res
      .status(HTTPStatus.BAD_REQUEST)
      .send('User name, user email and role are required.');
  }
  return connection.query(
    {
      sql: addUserQuery,
      values: [
        user.user_name,
        user.email,
        user.user_role,
        user.index,
      ],
    },
    error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY:
            return res
              .status(HTTPStatus.CONFLICT)
              .send(
                `User with email: "${user.email}" already exists.`
              );
          default:
            return res
              .status(HTTPStatus.INTERNAL_SERVER_ERROR)
              .send(`Cannot create user: ${error}`);
        }
      }
      return res.status(HTTPStatus.OK).send('User created.');
    }
  );
};

interface UpdateUserRequest extends Request {
  body: UserModel;
}
export const update = (req: UpdateUserRequest, res: Response) => {
  const user = req.body;
  return connection.query(
    {
      sql: updateUserQuery,
      values: [
        user.user_name,
        user.user_role,
        user.index,
        user.email,
      ],
    },
    error => {
      if (error) {
        switch (error.code) {
          case DUPLICATE_ENTRY:
            return res
              .status(HTTPStatus.CONFLICT)
              .send(
                `User with email: "${user.email}" already exists.`
              );
          default:
            return res
              .status(HTTPStatus.INTERNAL_SERVER_ERROR)
              .send(`Cannot create user: ${error}`);
        }
      }
      return res.status(HTTPStatus.OK).send('User updated.');
    }
  );
};

interface DeleteUserRequest extends Request {
  query: {
    email: string;
  };
}
export const deleteUser = (req: DeleteUserRequest, res: Response) => {
  if (!req.query.email) {
    return res
      .status(HTTPStatus.BAD_REQUEST)
      .send('User email is required.');
  }
  return connection.query(
    {
      sql: deleteUserQuery,
      values: [req.query.email],
    },
    (error, results) => {
      if (error) {
        return res
          .status(HTTPStatus.INTERNAL_SERVER_ERROR)
          .send(`Cannot delete user: ${error}`);
      }
      if (!results.affectedRows) {
        return res
          .status(HTTPStatus.NOT_FOUND)
          .send(
            `User with email: ${req.query.email} does not exists.`
          );
      }
      return res.status(HTTPStatus.OK).send('User deleted.');
    }
  );
};

interface ListUsersRequest extends Request {
  query: {
    search_param?: string;
    role?: string;
  };
}
interface ListUsersResponse extends Response {
  send: (body: { users: UserModel[] }) => Response;
}
export const list = (
  req: ListUsersRequest,
  res: ListUsersResponse
) => {
  const listUsersQuery = prepareListUsersQuery(
    req.query.search_param,
    req.query.role
  );
  return connection.query(
    {
      sql: listUsersQuery,
      values: [10, 0],
    },
    (error, results) => {
      if (error) {
        return res
          .status(HTTPStatus.INTERNAL_SERVER_ERROR)
          .send(`Cannot list users: ${error}`);
      }
      return res.status(HTTPStatus.OK).send({ users: results });
    }
  );
};
