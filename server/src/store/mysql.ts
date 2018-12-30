import { queryCallback } from 'mysql';

import { GroupDTO, UserDTO } from '../../../common/api';

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

export const addMeeting = (
  {
    name,
    date,
    groupId,
  }: {
    name: string;
    date: Date;
    groupId: string;
  },
  callback: Callback
) =>
  connection.query(
    {
      sql: 'INSERT INTO meetings (meeting_name, date, group_id) VALUES(?, ?, ?);',
      values: [name, date, groupId],
    },
    callback
  );

export const addGroup = (
  group: Pick<GroupDTO, 'group_name' | 'group_type' | 'academic_year'>,
  callback: Callback
) =>
  connection.query(
    {
      sql: `INSERT INTO \`groups\` (
        group_name, group_type, academic_year
      ) VALUES (
        ?, ?, ?
      )`,
      values: [group.group_name, group.group_type, group.academic_year],
    },
    callback
  );

export const deleteGroup = ({ groupId }: { groupId: string }, callback: Callback) =>
  connection.query(
    {
      sql: 'DELETE FROM `groups` WHERE id = ?',
      values: [groupId],
    },
    callback
  );

export const deleteMeeting = ({ meetingId }: { meetingId: string }, callback: Callback) =>
  connection.query(
    {
      sql: 'DELETE FROM `meetings` WHERE id = ?',
      values: [meetingId],
    },
    callback
  );

export const listMeetings = (groupId: GroupDTO['id'], callback: Callback) =>
  connection.query(
    {
      sql: `
        SELECT
          id, meeting_name, group_id, date
        FROM
          meetings
        WHERE
          group_id = ?
        ORDER BY date ASC
      `,
      values: [groupId],
    },
    callback
  );

export const getPresencesInGroup = ({ groupId }: { groupId: GroupDTO['id'] }, callback: Callback) =>
  connection.query(
    {
      sql: `
        SELECT
          user_id,
          user_name,
          student_index,
          GROUP_CONCAT(user_attended_in_meeting.meeting_id) AS presences
        FROM
          users
          JOIN user_attended_in_meeting ON (users.id = user_attended_in_meeting.user_id)
        WHERE
          user_attended_in_meeting.meeting_id IN (SELECT id from meetings where group_id = ?)
        GROUP BY
          user_id;
      `,
      values: [groupId],
    },
    callback
  );

export const getActivityInGroup = (groupId: GroupDTO['id'], callback: Callback) =>
  connection.query(
    {
      sql: `
        SELECT
          user_id, GROUP_CONCAT(meeting_id)
        FROM
          user_was_active_in_meeting
        WHERE user_id IN (
          SELECT user_id FROM user_belongs_to_group WHERE group_id = ?
        ) GROUP BY user_id
      `,
      values: [groupId],
    },
    callback
  );
