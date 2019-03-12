import { TaskDTO, UserDTO } from 'common';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const addGrade = (
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
    `,
      values: [userId, taskId, points],
    },
    callback
  );
