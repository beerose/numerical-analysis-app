import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { GroupDTO, UserDTO } from '../../../common/api';
import { apiMessages } from '../../../common/apiMessages';
import { ROLES } from '../../../common/roles';
import { db } from '../store';
import { connection } from '../store/connection';
import {
  addGroupQuery,
  deleteStudentFromGroupQuery,
  listGroupsQuery,
  listStudentsForGroupQuery,
  prepareAttachStudentToGroupQuery,
  upsertUserQuery,
} from '../store/queries';

import { readCSV } from './uploadUtils';

interface UploadRequest extends Request {
  body: { data: string; group_id: string };
}
export const upload = (req: UploadRequest, res: Response, next: NextFunction) => {
  const { users, isValid } = readCSV(req.body.data);
  if (!isValid) {
    res.status(codes.BAD_REQUEST).send({ error: apiMessages.invalidCSV });
    return;
  }
  if (!users || !users.length) {
    res.status(codes.PRECONDITION_FAILED).send({ error: apiMessages.emptyCSV });
    return;
  }

  const userRows = users.map(user => [
    user.user_name,
    user.email,
    user.user_role,
    user.student_index,
  ]);
  connection.beginTransaction(beginError => {
    if (beginError) {
      res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      return;
    }
    connection.query(
      {
        sql: upsertUserQuery,
        values: [userRows],
      },
      upsertErr => {
        if (upsertErr) {
          connection.rollback(() =>
            res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError })
          );
          return;
        }
        const groupId = req.body.group_id;
        const attachQuery = prepareAttachStudentToGroupQuery(users.map(u => u.email), groupId);
        connection.query(
          {
            sql: attachQuery,
          },
          attachErr => {
            if (attachErr) {
              console.error(attachErr);
              connection.rollback(() =>
                res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError })
              );
              return;
            }
            connection.commit(commitErr => {
              if (commitErr) {
                console.error(commitErr);
                connection.rollback(() =>
                  res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError })
                );
              }
              res.status(codes.OK).send({ message: apiMessages.usersUploaded });
              return next();
            });
          }
        );
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
  return db.updateUser(user, err => {
    if (err) {
      console.error(err);
      return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
    }
    return res.status(codes.OK).send({ message: apiMessages.userUpdated });
  });
};

interface AddStudentToGroupRequest extends Request {
  body: {
    user: UserDTO;
    group_id: string;
  };
}
export const addStudentToGroup = (req: AddStudentToGroupRequest, res: Response) => {
  const { user, group_id } = req.body;
  connection.query(
    {
      sql: upsertUserQuery,
      values: [[[user.user_name, user.email, ROLES.student, user.student_index]]],
    },
    upsertErr => {
      if (upsertErr) {
        console.error({ upsertErr });
        res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
        return;
      }
      const attachQuery = prepareAttachStudentToGroupQuery([user.email], group_id);
      connection.query(
        {
          sql: attachQuery,
        },
        attachErr => {
          if (attachErr) {
            console.error({ attachErr });
            res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
            return;
          }
          return res.status(codes.OK).send({ message: apiMessages.userCreated });
        }
      );
    }
  );
};

export * from './meetings';
interface AddGroupRequest extends Request {
  body: GroupDTO;
}

export const add = (req: AddGroupRequest, res: Response) => {
  const group = req.body;

  console.log({ group });

  connection.query(
    {
      sql: addGroupQuery,
      values: [group.group_name, group.group_type, group.class, group.academic_year],
    },
    (err, queryResult) => {
      if (err) {
        console.error({ err });
        return res.status(codes.INTERNAL_SERVER_ERROR).send({ error: apiMessages.internalError });
      }

      console.log('inserted group:', { abcd: queryResult });

      return res.status(codes.OK).send({ message: apiMessages.groupCreated });
    }
  );
};
