import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from '../../../common/apiMessages';
import { ROLES } from '../../../common/roles';
import { connection } from '../store/connection';
import {
  deleteStudentFromGroupQuery,
  listGroupsQuery,
  listStudentsForGroupQuery,
  updateUserQuery,
  upsertUserQuery,
} from '../store/queries';

import { readCSV } from './uploadUtils';

interface UploadRequest extends Request {
  body: { data: string; group: string };
}
export const upload = (req: UploadRequest, res: Response, next: NextFunction) => {
  const { users, isValid } = readCSV(req.body.data);
  if (!isValid) {
    return res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidCSV });
  }
  if (!users || !users.length) {
    return res.status(codes.PRECONDITION_FAILED).send({ error: apiMessages.emptyCSV });
  }

  const userRows = users.map(user => [
    user.user_name,
    user.email,
    user.user_role,
    user.student_index,
    req.body.group,
  ]);
  return connection.beginTransaction(beginError => {
    if (beginError) {
      return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    return connection.query(
      {
        sql: upsertUserQuery,
        values: [userRows],
      },
      upsertErr => {
        if (upsertErr) {
          connection.rollback(() =>
            res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError })
          );
        } else {
          connection.commit(commitErr => {
            if (commitErr) {
              connection.rollback(() =>
                res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError })
              );
            }
            res.status(codes.OK).send({ message: users });
            return next();
          });
        }
      }
    );
  });
};

export const list = (_req: Request, res: Response) => {
  return connection.query(
    {
      sql: listGroupsQuery,
    },
    (err, groups) => {
      if (err) {
        console.log(err);
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return res.status(codes.OK).send({ groups });
    }
  );
};

interface ListStudentsForGroupRequest extends Request {
  query: {
    group_id: string;
  };
}
export const listStudentsForGroup = (req: ListStudentsForGroupRequest, res: Response) => {
  return connection.query(
    {
      sql: listStudentsForGroupQuery,
      values: [req.query.group_id],
    },
    (err, students) => {
      if (err) {
        console.log(err);
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return res.status(codes.OK).send({ students });
    }
  );
};

interface DeleteUserFromGroupRequest extends Request {
  query: {
    user_id: string;
  };
}
export const deleteUserFromGroup = (req: DeleteUserFromGroupRequest, res: Response) => {
  return connection.query(
    {
      sql: deleteStudentFromGroupQuery,
      values: [req.body.user_id],
    },
    err => {
      if (err) {
        console.log(err);
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return res.status(codes.OK).send({ message: apiMessages.userDeleted });
    }
  );
};

interface UpdateStudentRequest extends Request {
  query: {
    user_id: string;
  };
}
export const updateStudent = (req: UpdateStudentRequest, res: Response) => {
  const user = req.body;
  return connection.query(
    {
      sql: updateUserQuery,
      values: [user.email, user.user_name, ROLES.student, user.student_index, user.id],
    },
    err => {
      if (err) {
        console.log(err);
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }
      return res.status(codes.OK).send({ message: apiMessages.userUpdated });
    }
  );
};
