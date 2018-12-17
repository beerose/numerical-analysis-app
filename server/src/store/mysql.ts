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

const searchSubQuery = (searchParam: string) => `
  (MATCH(user_name) AGAINST ("${searchParam}")
  OR MATCH(email) AGAINST ("${searchParam}")
  OR MATCH(student_index) AGAINST ("${searchParam}"))
`;

const roleSubQuery = (roles: string | string[]) => {
  if (typeof roles === 'string') {
    return `user_role = ("${roles}")`;
  }
  return `user_role IN (${roles.map(role => `"${role}"`)})`;
};

export const listUsers = (
  {
    searchParam,
    roles,
    limit,
    offset,
  }: { searchParam?: string; roles?: string | string[]; limit: number; offset: number },
  callback: Callback
) =>
  connection.query(
    {
      sql: `
      SELECT
        id, user_name, email, student_index, user_role
      FROM
        users
        ${searchParam || roles ? 'WHERE' : ''}
        ${searchParam ? searchSubQuery(searchParam) : ''}
        ${searchParam && roles ? 'AND' : ''}
        ${roles ? roleSubQuery(roles) : ''}
      ORDER BY updated_at DESC
      LIMIT ? OFFSET ?;
    `,
      values: [limit, offset],
    },
    callback
  );

export const countUsers = (
  { searchParam, roles }: { searchParam?: string; roles?: string | string[] },
  callback: Callback
) =>
  connection.query(
    {
      sql: `
      SELECT
        count(*) as total
      FROM
        users
        ${searchParam || roles ? 'WHERE' : ''}
        ${searchParam ? searchSubQuery(searchParam) : ''}
        ${searchParam && roles ? 'AND' : ''}
        ${roles ? roleSubQuery(roles) : ''};
      `,
    },
    callback
  );

export const findUserByEmail = ({ email }: { email: string }, callback: Callback) =>
  connection.query(
    {
      sql: 'SELECT * FROM users WHERE email = ?;',
      values: [email],
    },
    (err, res) => {
      if (err) return callback(err);
      if (!res.length) return callback(null, null);
      return callback(null, res[0]);
    }
  );

export const setUserPassword = (
  { passwordHash, email }: { passwordHash: string; email: string },
  callback: Callback
) =>
  connection.query(
    {
      sql: 'UPDATE users SET password = ? WHERE email = ?',
      values: [passwordHash, email],
    },
    callback
  );
