import { GroupDTO, MeetingDTO, UserDTO } from 'common';
import { MysqlError } from 'mysql';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const getMeetingsData = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<
    {
      id: UserDTO['id'];
      user_name: UserDTO['user_name'];
      student_index: UserDTO['student_index'];
      meetings_data: { meeting_id: MeetingDTO['id']; points: number }[];
    }[]
  >
) =>
  connection.query(
    {
      sql: /* sql */ `
      SELECT
      	id,
      	user_name,
      	student_index,
      	concat('[', GROUP_CONCAT(JSON_OBJECT('meeting_id', user_attended_meeting.meeting_id, 'points', user_attended_meeting.points) SEPARATOR ','), ']') AS meetings_data
      FROM
      	users
      	LEFT JOIN user_attended_meeting ON (users.id = user_attended_meeting.user_id)
      WHERE
      	id IN (
      		SELECT
      			user_id
      		FROM
      			user_belongs_to_group
      		WHERE
      			group_id = ?)
      	GROUP BY
      		id;
      `,
      values: [groupId],
    },
    (err, res) => {
      if (err) {
        return callback(err, res);
      }
      Object.keys(res).forEach(i => {
        res[i] = {
          ...res[i],
          meetings_data: JSON.parse(res[i].meetings_data),
        };
      });
      return callback(err, res);
    }
  );

export const addPresence = (
  { userId, meetingId }: { userId: UserDTO['id']; meetingId: MeetingDTO['id'] },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `INSERT IGNORE INTO user_attended_meeting (user_id, meeting_id) VALUES (?, ?);`,
      values: [userId, meetingId],
    },
    callback
  );

export const deletePresence = (
  { userId, meetingId }: { userId: UserDTO['id']; meetingId: MeetingDTO['id'] },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: /* sql */ `DELETE FROM user_attended_meeting WHERE user_id = ? AND meeting_id = ?`,
      values: [userId, meetingId],
    },
    callback
  );

export const getUsersMeetingsPoints = (
  { groupId }: { groupId: GroupDTO['id'] },
  callback: QueryCallback<
    {
      user_id: UserDTO['id'];
      activity_points: number;
      sum_presences: number;
    }[]
  >
) =>
  connection.query(
    {
      sql: /* sql */ `
        SELECT
	        user_id,
	        count(meeting_id) AS sum_presences,
	        sum(points) AS activity_points
        FROM
        	user_attended_meeting
        WHERE
        	meeting_id IN (
        		SELECT
        			id
        		FROM
        			meetings
        		WHERE
        			group_id = ?)
        	GROUP BY
        		user_id;
          `,
      values: [groupId],
    },
    callback
  );
