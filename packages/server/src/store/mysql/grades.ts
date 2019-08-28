import {
  GroupDTO,
  GroupId,
  TaskDTO,
  UserDTO,
  UserId,
  UserTaskPoints,
} from 'common';
import { sql } from 'tag-sql';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const setTaskPoints = (
  {
    userId,
    taskId,
    points,
    groupId,
  }: {
    userId: UserDTO['id'];
    taskId: TaskDTO['id'];
    groupId: GroupDTO['id'];
    points: number;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /*sql*/ `
      INSERT INTO user_has_points(user_id, task_id, group_id, points)
      VALUES(?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      points = VALUES(points);
    `,
      values: [userId, taskId, groupId, points],
    },
    callback
  );

export const getGrades = (
  { taskId, groupId }: { taskId: TaskDTO['id']; groupId: GroupDTO['id'] },
  callback: QueryCallback<UserTaskPoints[]>
) =>
  connection.query(
    {
      sql: `SELECT * FROM user_has_points WHERE task_id = ? AND group_id = ?;`,
      values: [taskId, groupId],
    },
    callback
  );

export const getUsersTaskPoints = (
  { groupId, userId }: { groupId: GroupId; userId?: UserId },
  callback: QueryCallback<Array<{ user_id: UserId; tasks_grade: number }>>
) =>
  connection.query(
    sql`
SELECT
	user_id,
	sum(uhp.points * ght.weight) as tasks_grade
FROM
	user_belongs_to_group ubg
	LEFT JOIN (
		SELECT
			user_id,
			points,
			task_id
		FROM
			user_has_points
		WHERE
			group_id = ${groupId}) uhp USING (user_id)
	RIGHT JOIN (
		SELECT
			task_id, weight
		FROM
			group_has_task
		WHERE
			group_id = ${groupId}) ght ON (uhp.task_id = ght.task_id)
WHERE
  ubg.group_id = ${groupId}
  ${userId ? sql`AND user_id = ${userId}` : sql.empty}
GROUP BY
	user_id;
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
