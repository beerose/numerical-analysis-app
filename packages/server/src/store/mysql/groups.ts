import { GroupDTO, UserDTO } from 'common';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const getGroup = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<[GroupDTO & UserDTO['user_name']]>
) =>
  connection.query(
    {
      sql: `
      SELECT g.*, u.user_name as lecturer_name
      FROM \`groups\` g
      JOIN
        users u ON (g.lecturer_id = u.id)
      WHERE
        g.id = ?;`,
      values: [groupId],
    },
    callback
  );

export const addGroup = (
  group: Pick<
    GroupDTO,
    'group_name' | 'group_type' | 'academic_year' | 'lecturer_id'
  >,
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `INSERT INTO
        \`groups\` (group_name, group_type, academic_year, lecturer_id)
      VALUES (?, ?, ?, ?)`,
      values: [
        group.group_name,
        group.group_type,
        group.academic_year,
        group.lecturer_id,
      ],
    },
    callback
  );

export const deleteGroup = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: 'DELETE FROM `groups` WHERE id = ?',
      values: [groupId],
    },
    callback
  );

export const listUsersWithGroup = (
  callback: QueryCallback<(UserDTO & { group_ids: string })[]>
) =>
  connection.query(
    {
      sql: `
      SELECT
        DISTINCT id, user_name, email, student_index, GROUP_CONCAT(group_id) as group_ids
      FROM
        users AS u
      LEFT JOIN user_belongs_to_group AS ug
      ON (u.id = ug.user_id)
      GROUP BY u.id;
      `,
    },
    callback
  );
