import { GroupDTO, MeetingDTO, MeetingId, UserDTO } from 'common';

import { connection } from '../connection';

import { QueryCallback } from './QueryCallback';

export const addMeeting = (
  {
    name,
    date,
    groupId,
  }: {
    name: string;
    date: Date;
    groupId: string;
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql:
        'INSERT INTO meetings (meeting_name, date, group_id) VALUES(?, ?, ?);',
      values: [name, date, groupId],
    },
    callback
  );

export const updateMeeting = (
  {
    id,
    name,
    date,
  }: { id: MeetingId; name: MeetingDTO['meeting_name']; date: Date },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: 'UPDATE meetings SET meeting_name = ?, date = ? WHERE id = ?;',
      values: [name, date, id],
    },
    callback
  );

export const deleteMeeting = (
  { meetingId }: { meetingId: MeetingId },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: 'DELETE FROM `meetings` WHERE id = ?',
      values: [meetingId],
    },
    callback
  );

export const listMeetings = (
  groupId: GroupDTO['id'],
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `
      SELECT
        id, meeting_name, group_id, date
      FROM
        meetings
      WHERE
        group_id = ?
      ORDER BY date ASC
    `,
      values: [groupId],
    },
    callback
  );

export const removeStudentFromGroup = (
  {
    userId,
    groupId,
  }: {
    userId: UserDTO['id'];
    groupId: GroupDTO['id'];
  },
  callback: QueryCallback
) =>
  connection.query(
    {
      sql: `
    DELETE FROM user_belongs_to_group WHERE user_id = ? AND group_id = ?
  `,
      values: [userId, groupId],
    },
    callback
  );
