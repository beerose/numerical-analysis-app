import {
  GroupDTO,
  GroupId,
  StudentTasksSummary,
  UserDTO,
  UserId,
  UserPrivileges,
  UserWithGroups,
} from 'common';
import { Omit } from 'react-router';
import { sql } from 'tag-sql';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const getUser = (
  userId: UserDTO['id'],
  callback: QueryCallback<
    Array<Omit<UserWithPassword, 'privileges'> & { privileges: string }>
  >
) =>
  connection.query(
    {
      sql: `SELECT * FROM users WHERE id = ?;`,
      values: [userId],
    },
    callback
  );

export const addUser = (user: Omit<UserDTO, 'id'>, callback: QueryCallback) =>
  connection.query(
    {
      sql: /* sql */ `
        INSERT INTO
          users (
            user_name,
            email,
            user_role,
            student_index
          )
        VALUES (?, ?, ?, ?);`,
      values: [user.user_name, user.email, user.user_role, user.student_index],
    },
    callback
  );

export const updateUser = (user: UserDTO, callback: QueryCallback) =>
  connection.query(
    {
      sql: /* sql */ `
  UPDATE
    users
  SET
    email = ?,
    user_name = ?,
    user_role = ?,
    student_index = ?
  WHERE id = ?;
    `,
      values: [
        user.email,
        user.user_name,
        user.user_role,
        user.student_index,
        user.id,
      ],
    },
    callback
  );

export const deleteUser = ({ id }: { id: string }, callback: QueryCallback) =>
  connection.query(
    {
      sql: 'DELETE FROM users WHERE id = ?;',
      values: [id],
    },
    callback
  );

const searchSubQuery = (searchParam: string) => /* sql */ `
(MATCH(user_name) AGAINST ("${searchParam}")
OR MATCH(email) AGAINST ("${searchParam}")
OR MATCH(student_index) AGAINST ("${searchParam}"))
`;

const roleSubQuery = (roles: string | string[]) => {
  if (typeof roles === 'string') {
    return `user_role = ("${roles}")`;
  }
  // tslint:disable-next-line:no-nested-template-literals
  return `user_role IN (${roles.map(role => `"${role}"`)})`;
};

export const listUsers = (
  {
    searchParam,
    roles,
    limit,
    offset,
  }: {
    searchParam?: string;
    roles?: string | string[];
    limit: number;
    offset: number;
  },
  callback: QueryCallback<
    Array<Omit<UserDTO, 'active_user' | 'privileges'> & { privileges: string }>
  >
) =>
  connection.query(
    {
      sql: /* sql */ `
    SELECT
      id, user_name, email, student_index, user_role, privileges
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
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `
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

type UserWithPassword = UserDTO & {
  password: string;
};

export const findUserByEmail = (
  { email }: { email: string },
  callback: QueryCallback<UserWithPassword | null>
) =>
  connection.query(
    {
      sql: 'SELECT * FROM users WHERE email = ?;',
      typeCast: (field, orig) => {
        if (field.type === 'JSON') {
          let parsed: UserPrivileges = {};
          try {
            parsed = JSON.parse(field.string());
          } catch {
            parsed = {};
          }
          return parsed;
        }
        return orig();
      },
      values: [email],
    },
    (err, res) => {
      if (err) {
        return callback(err, res);
      }
      if (!res.length) {
        return callback(null, null);
      }
      return callback(null, res[0]);
    }
  );

export const setUserPassword = (
  { passwordHash, email }: { passwordHash: string; email: string },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: 'UPDATE users SET password = ? WHERE email = ?',
      values: [passwordHash, email],
    },
    callback
  );

export const upsertUser = (
  user: Omit<UserDTO, 'id'>,
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `
    INSERT IGNORE INTO
    users (
      user_name,
      email,
      user_role,
      student_index
    )
    VALUES ?
    `,
      values: [
        [[user.user_name, user.email, user.user_role, user.student_index]],
      ],
    },
    callback
  );

export const attachStudentToGroup = (
  {
    email,
    groupId,
  }: {
    email: UserDTO['email'];
    groupId: GroupDTO['id'];
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `
    INSERT IGNORE INTO user_belongs_to_group(user_id, group_id)
    VALUES ((SELECT id FROM users WHERE email = ?), ?)
  `,
      values: [email, groupId],
    },
    callback
  );

export const setUserPrivileges = (
  { privileges, userId }: { privileges: UserPrivileges; userId: UserDTO['id'] },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `
    UPDATE users
    SET privileges = ?
    WHERE id = ?
        `,
      values: [JSON.stringify(privileges), userId],
    },
    callback
  );

export const getUserPrivileges = (
  { userId }: { userId: UserDTO['id'] },
  callback: QueryCallback<string | null>
) =>
  connection.query(
    {
      sql: /* sql */ `SELECT privileges FROM users WHERE id = ?`,
      values: [userId],
    },
    (err, res) => {
      if (err) {
        return callback(err, res);
      }
      if (!res.length) {
        return callback(null, null);
      }
      return callback(null, res[0].privileges);
    }
  );

// student
export const getStudentGroups = (
  { userId }: { userId: UserDTO['id'] },
  callback: QueryCallback<GroupDTO[]>
) =>
  connection.query(
    sql`
      SELECT g.*, u.user_name as lecturer_name
      FROM
        (SELECT group_id
        FROM user_belongs_to_group ubg
        WHERE ubg.user_id = ${userId}) student_groups
      INNER JOIN \`groups\` g
      ON g.id = student_groups.group_id
      INNER JOIN users u
      ON u.id = g.lecturer_id;
    `,
    (err, res) => {
      if (err) {
        return callback(err, res);
      }

      return callback(null, res);
    }
  );

export const getStudentsTasks = (
  { userId, groupId }: { userId: UserDTO['id']; groupId?: GroupDTO['id'] },
  callback: QueryCallback<StudentTasksSummary>
) =>
  connection.query(
    sql`
      SELECT 
        t.id, t.name, t.kind, 
        (task_id * weight) AS pts, 
        (t.max_points * weight) AS max_pts, 
        t.start_upload_date, t.end_upload_date, 
        t.created_at, t.updated_at, t.data 
      FROM user_has_points
      JOIN group_has_task
        USING(task_id)
      JOIN tasks t
        ON t.id = task_id 
      WHERE user_id = ${userId} ${
      groupId === undefined ? sql.empty : sql`AND group_id = ${groupId}`
    };`,
    callback
  );

type StringifiedGroupData = { group_ids: string; groups_grades: string };

/**
 * TODO:
 * This is kinda ugly and does redundant things (like group by when we know id already)
 */
export const getStudentWithGroup = (
  { groupId, userId }: { groupId: GroupId; userId: UserId },
  callback: QueryCallback<[UserDTO & StringifiedGroupData]>
) =>
  connection.query(
    sql`
      SELECT
        DISTINCT id, user_name, email, student_index, GROUP_CONCAT(group_id) as group_ids,
        concat('[', GROUP_CONCAT(JSON_OBJECT('group_id', group_id, 'grade', grade) SEPARATOR ','), ']') AS groups_grades
      FROM
        (SELECT * FROM users WHERE id = ${userId}) AS u
      LEFT JOIN user_belongs_to_group AS ug
      ON (u.id = ug.user_id)
      WHERE ug.group_id = ${groupId}
      GROUP BY u.id;
  `,
    callback
  );
