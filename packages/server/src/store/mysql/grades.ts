import { GroupDTO, TaskDTO, UserDTO, UserTaskPoints } from 'common';
import { sql } from 'tag-sql';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const setTaskPoints = (
  {
    userId,
    taskId,
    points,
  }: {
    userId: UserDTO['id'];
    taskId: TaskDTO['id'];
    points: number;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /*sql*/ `
      INSERT INTO user_has_points(user_id, task_id, points)
      VALUES(?, ?, ?)
      ON DUPLICATE KEY UPDATE
      points = VALUES(points);
    `,
      values: [userId, taskId, points],
    },
    callback
  );

export const getGrades = (
  { taskId }: { taskId: TaskDTO['id'] },
  callback: QueryCallback<UserTaskPoints[]>
) =>
  connection.query(
    {
      sql: `SELECT * FROM user_has_points WHERE task_id = ?;`,
      values: [taskId],
    },
    callback
  );

export const getUsersTaskPoints = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<
    Array<{ user_id: UserDTO['id']; tasks_grade: number }>
  >
) =>
  connection.query(
    sql`
      SELECT uhp.user_id, sum(points * weight) as tasks_grade FROM
      user_belongs_to_group ubg
      JOIN group_has_task ght USING (group_id)
      JOIN user_has_points uhp USING (task_id)
      WHERE group_id = ${groupId}
      GROUP BY uhp.user_id;
    `,
    callback
  );

export const setFinalGrade = (
  {
    groupId,
    userId,
    grade,
  }: {
    groupId: GroupDTO['id'];
    userId: UserDTO['id'];
    grade: number;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `
    UPDATE user_belongs_to_group
    SET grade = ?
    WHERE group_id = ?
    AND user_id = ?`,
      values: [grade, groupId, userId],
    },
    callback
  );

export const getTasksMaxPointsPerGroup = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<Array<{ max: number }>>
) =>
  connection.query(
    {
      sql: /* sql */ `
    SELECT
	    sum(max_points * weight) as max
    FROM
	    group_has_task ght
	    JOIN tasks ON (ght.task_id = tasks.id)
    WHERE
      group_id = ?;`,
      values: [groupId],
    },
    callback
  );
