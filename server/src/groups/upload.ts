import { UserDTO, UserRole } from 'common';
import { NextFunction, Request, Response } from 'express';
import * as codes from 'http-status-codes';

import { apiMessages } from 'common';
import { connection } from '../store/connection';
import {
  prepareAttachStudentToGroupQuery,
  upsertUserQuery,
} from '../store/queries';

interface UploadRequest extends Request {
  body: { data: string; group_id: string };
}
export const upload = (
  req: UploadRequest,
  res: Response,
  next: NextFunction
) => {
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
      res
        .status(codes.INTERNAL_SERVER_ERROR)
        .send({ error: apiMessages.internalError });
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
            res
              .status(codes.INTERNAL_SERVER_ERROR)
              .send({ error: apiMessages.internalError })
          );
          return;
        }
        const groupId = req.body.group_id;
        const attachQuery = prepareAttachStudentToGroupQuery(
          users.map(u => u.email),
          groupId
        );
        connection.query(
          {
            sql: attachQuery,
          },
          attachErr => {
            if (attachErr) {
              console.error(attachErr);
              connection.rollback(() =>
                res
                  .status(codes.INTERNAL_SERVER_ERROR)
                  .send({ error: apiMessages.internalError })
              );
              return;
            }
            connection.commit(commitErr => {
              if (commitErr) {
                console.error(commitErr);
                connection.rollback(() =>
                  res
                    .status(codes.INTERNAL_SERVER_ERROR)
                    .send({ error: apiMessages.internalError })
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

const DELIMITER = ',';

const isCSVRowValid = (line: string) => {
  const values = line.split(DELIMITER);
  return values.length === 4 && values.every(value => value !== '');
};

// csv format: name, surename, index, email
type NewUser = Pick<
  UserDTO,
  'email' | 'student_index' | 'user_name' | 'user_role'
>;
const readCSV = (
  csvString: string
): { users?: NewUser[]; isValid: boolean } => {
  const lines = csvString.trim().split('\n');
  if (!lines.every(line => isCSVRowValid(line))) {
    return { isValid: false };
  }

  const users: NewUser[] = [];
  lines.forEach(line => {
    const values = line.split(DELIMITER);
    const user = {
      email: values[3],
      student_index: values[2],
      user_name: `${values[0]} ${values[1]}`,
      user_role: UserRole.student,
    };
    users.push(user);
  });
  return { users, isValid: true };
};
