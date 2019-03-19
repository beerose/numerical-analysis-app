import { TaskDTO, UserDTO } from 'common';

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
