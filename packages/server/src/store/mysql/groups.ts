import {
  GroupDTO,
  GroupId,
  GroupWithLecturer,
  TaskDTO,
  TaskId,
  UserDTO,
  UserId,
} from 'common';
import { Omit } from 'lodash';
import { sql } from 'tag-sql';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

type DbExtractedGroup = Omit<GroupWithLecturer, 'data'> & { data: string };
type DbExtractedTask = Omit<TaskDTO, 'data'> & { data: string };

export const getGroup = (
  { groupId }: { groupId: GroupId },
  callback: QueryCallback<[DbExtractedGroup]>
) =>
  connection.query(
    {
      sql: `
      SELECT g.*, u.user_name as lecturer_name
      FROM \`groups\` g
      LEFT JOIN
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
    'group_name' | 'group_type' | 'semester' | 'lecturer_id'
  >,
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `INSERT INTO
        \`groups\` (group_name, group_type, semester, lecturer_id)
      VALUES (?, ?, ?, ?)`,
      values: [
        group.group_name,
        group.group_type,
        group.semester,
        group.lecturer_id,
      ],
    },
    callback
  );

export const updateGroup = (
  group: Pick<
    GroupDTO,
    'group_name' | 'group_type' | 'semester' | 'lecturer_id' | 'id' | 'data'
  >,
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `
  UPDATE \`groups\` SET
    group_name = ?,
    group_type = ?,
    semester = ?,
    lecturer_id = ?,
    data = ?
  WHERE id = ?;
  `,
      values: [
        group.group_name,
        group.group_type,
        group.semester,
        group.lecturer_id,
        JSON.stringify(group.data),
        group.id,
      ],
    },
    callback
  );

export const deleteGroup = (
  { groupId }: { groupId: GroupId },
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
  groupId: GroupId,
  callback: QueryCallback<
    Array<UserDTO & { group_ids: string; groups_grades: string }>
  >
) =>
  connection.query(
    sql`
      SELECT
        DISTINCT id, user_name, email, student_index, GROUP_CONCAT(group_id) as group_ids,
        concat('[', GROUP_CONCAT(JSON_OBJECT('group_id', group_id, 'grade', grade) SEPARATOR ','), ']') AS groups_grades
      FROM
        users AS u
      LEFT JOIN user_belongs_to_group AS ug
      ON (u.id = ug.user_id)
      WHERE user_role = "student" AND ug.group_id = ${groupId}
      GROUP BY u.id;
    `,
    callback
  );

export const deleteFromGroup = (
  {
    userId,
    groupId,
  }: {
    userId: UserId;
    groupId: GroupId;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql:
        'DELETE FROM user_belongs_to_group WHERE user_id = ? AND group_id = ?;',
      values: [userId, groupId],
    },
    callback
  );

export const listGroups = (
  { lecturerId }: { lecturerId?: GroupDTO['lecturer_id'] },
  callback: QueryCallback<GroupDTO[]>
) =>
  connection.query(
    sql`
      SELECT
        *
      FROM
        \`groups\`
      ${lecturerId ? sql`WHERE lecturer_id = ${lecturerId}` : sql.empty}
      ORDER BY created_at DESC
    `,
    callback
  );

export const listTasksForGroup = (
  {
    groupId,
  }: {
    groupId?: GroupId;
  },
  callback: QueryCallback<TaskDTO[]>
) => {
  const joinWithTasks = /* sql */ `
    JOIN group_has_task ght
      ON (t.id = ght.task_id)
      WHERE ght.group_id =?
    `;

  return connection.query(
    {
      sql: /* sql */ `
    SELECT t.*
    FROM tasks t
    ${groupId ? joinWithTasks : ''}
    ORDER BY created_at DESC`,
      values: groupId ? [groupId] : [],
    },
    callback
  );
};

export const deleteTaskFromGroup = (
  {
    groupId,
    taskId,
  }: {
    groupId: GroupId;
    taskId: TaskId;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: 'DELETE FROM group_has_task WHERE task_id = ? AND group_id = ?;',
      values: [taskId, groupId],
    },
    callback
  );

export const insertTask = (
  task: Partial<Omit<TaskDTO, 'id' | 'weight'>>,
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `
    INSERT INTO
      tasks(name, description, kind, max_points,
        verify_upload, results_date, end_upload_date,
        start_upload_date, end_vote_date, start_vote_date, data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      values: [
        task.name,
        task.description,
        task.kind,
        task.max_points,
        task.verify_upload,
        task.results_date,
        task.end_upload_date,
        task.start_upload_date,
        task.end_vote_date,
        task.start_vote_date,
        JSON.stringify(task.data),
      ],
    },
    callback
  );

export const updateTask = (
  task: Partial<Omit<TaskDTO, 'weight'>>,
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `
      UPDATE
        tasks
      SET
        name = ?,
        description = ?,
        kind = ?,
        max_points = ?,
        verify_upload = ?,
        results_date = ?,
        end_upload_date = ?,
        start_upload_date = ?,
        end_vote_date = ?,
        start_vote_date = ?,
        data = ?
      WHERE id = ?;
        `,
      values: [
        task.name,
        task.description,
        task.kind,
        task.max_points,
        task.verify_upload,
        task.results_date,
        task.end_upload_date,
        task.start_upload_date,
        task.end_vote_date,
        task.start_vote_date,
        JSON.stringify(task.data),
        task.id,
      ],
    },
    callback
  );

export const attachTaskToGroup = (
  {
    taskId,
    groupId,
    weight,
  }: {
    taskId: TaskId;
    groupId: GroupId;
    weight: TaskDTO['weight'];
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql:
        'INSERT INTO group_has_task(group_id, task_id, weight) VALUES (?, ?, ?);',
      values: [groupId, taskId, weight],
    },
    callback
  );

export const updateTaskInGroup = (
  {
    taskId,
    groupId,
    weight,
  }: {
    taskId: TaskId;
    groupId: GroupId;
    weight: TaskDTO['weight'];
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql:
        'UPDATE group_has_task SET weight = ? WHERE task_id = ? AND group_id = ?;',
      values: [weight, taskId, groupId],
    },
    callback
  );

export const getTask = (
  { taskId, groupId }: { taskId: TaskId; groupId: GroupId },
  callback: QueryCallback<DbExtractedTask | null>
) =>
  connection.query(
    {
      sql: `
        SELECT t.*, ght.weight
        FROM tasks t JOIN group_has_task ght ON (t.id = ght.task_id)
        WHERE t.id = ? AND ght.group_id = ?`,
      values: [taskId, groupId],
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

export const getAttachedGroups = (
  {
    groupId,
  }: {
    groupId: GroupId;
  },
  callback: QueryCallback<GroupDTO[]>
) =>
  connection.query(
    {
      sql: 'SELECT * FROM `groups` WHERE parent_group = ?;',
      values: [groupId],
    },
    callback
  );

export const attachGroup = (
  {
    parentGroupId,
    groupId,
  }: {
    parentGroupId: GroupId;
    groupId: GroupId;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: 'UPDATE `groups` SET parent_group = ? WHERE id = ?',
      values: [parentGroupId, groupId],
    },
    callback
  );

export const detachGroup = (
  {
    groupId,
  }: {
    groupId: GroupId;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: 'UPDATE `groups` SET parent_group = NULL WHERE id = ?',
      values: [groupId],
    },
    callback
  );
