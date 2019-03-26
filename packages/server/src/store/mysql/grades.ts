import { TaskDTO, UserDTO, Grade, GroupDTO } from 'common';

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
      sql: `
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
  callback: QueryCallback<Grade[]>
) =>
  connection.query(
    {
      sql: `SELECT * FROM user_has_points WHERE task_id = ?;`,
      values: [taskId],
    },
    callback
  );

export const getUsersResults = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<{ user_id: UserDTO['id']; tasks_grade: number }[]>
) =>
  connection.query(
    {
      sql: /* sql */ `
    SELECT
	    uhp.user_id, sum(uhp.points * ght.weight) AS tasks_grade
    FROM
	    group_has_task ght
	    JOIN user_has_points uhp ON (ght.task_id = uhp.task_id)
    WHERE
      ght.group_id=?
    GROUP BY
      uhp.user_id;
    `,
      values: [groupId],
    },
    callback
  );

export const getTasksMaxPointsPerGroup = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<{ max: number }[]>
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
