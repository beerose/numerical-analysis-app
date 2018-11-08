import { Request, Response } from 'express';
import * as HTTPStatus from 'http-status-codes';

import { UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { connection } from '../store/connection';
import {
  addUserQuery,
  deleteUserQuery,
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
            return res.status(HTTPStatus.CONFLICT).send({
              error: apiMessages.userAlreadyExists,
            });
          default:
            return res
              .status(HTTPStatus.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(HTTPStatus.OK).send({ message: apiMessages.userCreated });
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
            return res
              .status(HTTPStatus.CONFLICT)
              .send({ error: apiMessages.userAlreadyExists });
          default:
            return res
              .status(HTTPStatus.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError });
        }
      }
      return res.status(HTTPStatus.OK).send({ message: apiMessages.userUpdated });
    }
  );
};

interface DeleteUserRequest extends Request {
  query: { id: string };
}
export const deleteUser = (req: DeleteUserRequest, res: Response) => {
  return connection.query(
    {
      sql: deleteUserQuery,
      values: [req.query.id],
    },
    (error, results) => {
      if (error) {
        return res
          .status(HTTPStatus.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }
      if (!results.affectedRows) {
        return res.status(HTTPStatus.NOT_FOUND).send({ error: apiMessages.userNotFound });
      }
      return res.status(HTTPStatus.OK).send({ message: apiMessages.userDeleted });
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
  send: (body: { users: UserDTO[] }) => Response;
}
export const list = (req: ListUsersRequest, res: ListUsersResponse) => {
  const listUsersQuery = prepareListUsersQuery(req.query.search_param, req.query.role);
  return connection.query(
    {
      sql: listUsersQuery,
      values: [10, 0],
    },
    (error, results) => {
      if (error) {
        return res
          .status(HTTPStatus.INTERNAL_SERVER_ERROR)
          .send({ error: apiMessages.internalError });
      }
      return res.status(HTTPStatus.OK).send({ users: results });
    }
  );
};
