import { queryCallback } from 'mysql';

import { UserDTO } from '../../../common/api';

import { connection } from './connection';

type Callback = queryCallback;

export const addUser = (user: UserDTO, callback: Callback) =>
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
    callback
  );

export const updateUser = (user: UserDTO, callback: Callback) =>
  connection.query(
    {
      sql: `
    UPDATE
      users
    SET
      email = ?,
      user_name = ?,
      user_role = ?,
      student_index = ?
    WHERE id = ?;
      `,
      values: [user.email, user.user_name, user.user_role, user.student_index, user.id],
    },
    callback
  );

export const deleteUser = ({ id }: { id: string }, callback: Callback) =>
  connection.query(
    {
      sql: 'DELETE FROM users WHERE id = ?;',
      values: [id],
    },
    callback
  );
