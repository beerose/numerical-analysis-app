import { MeetingDTO, UserDTO } from 'common';
import { queryCallback as Callback } from 'mysql';

import { connection } from '../connection';

export * from './users';
export * from './meetings';
export * from './groups';
export * from './presences';

export const setActivity = (
  {
    userId,
    meetingId,
    points,
  }: { userId: UserDTO['id']; meetingId: MeetingDTO['id']; points: number },
  callback: Callback
) =>
  connection.query(
    {
      sql: `
        INSERT INTO
          user_was_active_in_meeting(user_id, meeting_id, points)
        VALUES
          (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          points = VALUES(points)`,
      values: [userId, meetingId, points],
    },
    callback
  );
