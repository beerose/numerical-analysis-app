import { MysqlError } from 'mysql';

import { UserDTO } from '../../../common/api';

import { connection } from './connection';

export const addUser = (user: UserDTO, callback: (err: MysqlError | null, res: any) => void) =>
  connection.query(
    {
      sql: `
    INSERT INTO
      users (
        user_name,
        email,
        user_role,
        student_index
      )
    VALUES (?, ?, ?, ?);
    `,
      values: [user.user_name, user.email, user.user_role, user.student_index],
    },
    (err, res) => callback(err, res)
  );
