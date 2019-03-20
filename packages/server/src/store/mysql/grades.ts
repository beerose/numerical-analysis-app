import { TaskDTO, UserDTO, Grade, GroupDTO } from 'common';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const setGrade = (
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
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `
    SELECT
	    uhp.user_id, sum(uhp.points * ght.weight) AS result
    FROM
	    group_has_task ght
	    JOIN user_has_points uhp ON (ght.task_id = uhp.task_id)
    WHERE
      ght.group_id="54"
    GROUP BY
      uhp.user_id;`,
      values: [groupId],
    },
    callback
  );
