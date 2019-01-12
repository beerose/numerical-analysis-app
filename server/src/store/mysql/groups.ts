import { GroupDTO } from 'common';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const getGroup = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<[GroupDTO]>
) =>
  connection.query(
    {
      sql: `SELECT * FROM \`groups\` g WHERE g.id = ?`,
      values: [groupId],
    },
    callback
  );

export const addGroup = (
  group: Pick<GroupDTO, 'group_name' | 'group_type' | 'academic_year'>,
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `INSERT INTO
        \`groups\` (group_name, group_type, academic_year)
      VALUES (?, ?, ?)`,
      values: [group.group_name, group.group_type, group.academic_year],
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
