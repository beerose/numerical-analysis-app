import * as qs from 'query-string';
import { Omit } from 'react-router';

import {
  ApiResponse,
  GroupDTO,
  MeetingDetailsModel,
  MeetingDTO,
  Routes,
  UserDTO,
} from '../../../common/api';
import { showMessage } from '../utils/message';

import { SERVER_URL } from '.';
import { authFetch } from './authFetch';

const { Groups } = Routes;

export const uploadUsers = async (fileContent: string, groupId: string) => {
  const options = {
    body: JSON.stringify({ data: fileContent, group_id: groupId }),
    method: 'POST',
  };

  await authFetch<{ message: string }>(SERVER_URL + Groups.Upload, options).then(showMessage);
};

export const listGroups = async (): Promise<{ groups: GroupDTO[] }> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ groups: GroupDTO[] }>(SERVER_URL + Groups.List, options);
};

export const listStudentsForGroup = async (groupId: string): Promise<{ students: UserDTO[] }> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ students: UserDTO[] }>(
    `${SERVER_URL + Groups.Students.List}?${qs.stringify({ group_id: groupId })}`,
    options
  );
};

export const deleteUserFromGroup = async (userId: string) => {
  const options = {
    body: JSON.stringify({ user_id: userId }),
    method: 'DELETE',
  };

  return authFetch(SERVER_URL + Groups.Students.AddToGroup, options).then(showMessage);
};

export const addStudentToGroup = async (user: UserDTO, groupId: string) => {
  const options = {
    body: JSON.stringify({ user, group_id: groupId }),
    method: 'POST',
  };

  await authFetch(SERVER_URL + Groups.Students.AddToGroup, options).then(showMessage);
};

export const addGroup = (group: Omit<GroupDTO, 'id'>): Promise<{ group_id: string }> => {
  const options = {
    body: JSON.stringify(group),
    method: 'POST',
  };

  return authFetch<ApiResponse & { group_id: string }>(SERVER_URL + Groups.Create, options).then(
    res => {
      showMessage(res);
      return res;
    }
  );
};

export const addMeeting = async (
  meeting: Pick<MeetingDTO, 'meeting_name' & 'date'>,
  groupId: string
) => {
  const options = {
    body: JSON.stringify({ meeting, group_id: groupId }),
    method: 'POST',
  };

  await authFetch(SERVER_URL + Groups.Meetings.Create, options).then(showMessage);
};

export const updateMeeting = async (meeting: Pick<MeetingDTO, 'meeting_name' & 'date' & 'id'>) => {
  const options = {
    body: JSON.stringify({ meeting }),
    method: 'POST',
  };

  await authFetch(SERVER_URL + Groups.Meetings.Update, options).then(showMessage);
};

export const deleteMeeting = async (id: number) => {
  const options = {
    body: JSON.stringify({ meeting_id: id }),
    method: 'DELETE',
  };

  await authFetch(SERVER_URL + Groups.Meetings.Delete, options).then(showMessage);
};

export const listMeetings = (groupId: string): Promise<MeetingDTO[]> => {
  const options = {
    method: 'GET',
  };

  return authFetch<MeetingDTO[]>(
    `${SERVER_URL + Groups.Meetings.List}?${qs.stringify({ group_id: groupId })}`,
    options
  );
};

export const deleteGroup = (groupId: string) => {
  const options = {
    body: JSON.stringify({ group_id: groupId }),
    method: 'DELETE',
  };

  return authFetch<MeetingDTO[]>(SERVER_URL + Groups.Delete, options);
};

export const getMeetingsDetails = (groupId: string): Promise<MeetingDetailsModel[]> => {
  const options = {
    method: 'GET',
  };

  return authFetch<{ details: MeetingDetailsModel[] }>(
    `${SERVER_URL + Groups.Meetings.Details}?${qs.stringify({ group_id: groupId })}`,
    options
  ).then(res =>
    res.details.map(item => ({
      data: {
        activities: item.data.activities,
        presences: new Set(item.data.presences),
      },
      student: item.student,
    }))
  );
};

export const addPresence = (studentId: UserDTO['id'], meetingId: MeetingDTO['id']) => {
  const options = {
    body: JSON.stringify({ student_id: studentId, meeting_id: meetingId }),
    method: 'POST',
  };

  return authFetch<MeetingDTO[]>(SERVER_URL + Groups.Meetings.AddPresence, options);
};

export const deletePresence = (studentId: UserDTO['id'], meetingId: MeetingDTO['id']) => {
  const options = {
    body: JSON.stringify({ student_id: studentId, meeting_id: meetingId }),
    method: 'DELETE',
  };

  return authFetch<MeetingDTO[]>(SERVER_URL + Groups.Meetings.DeletePresence, options);
};

export const setActivity = (
  studentId: UserDTO['id'],
  meetingId: MeetingDTO['id'],
  points: number
) => {
  const options = {
    body: JSON.stringify({ points, student_id: studentId, meeting_id: meetingId }),
    method: 'POST',
  };

  return authFetch<MeetingDTO[]>(SERVER_URL + Groups.Meetings.SetActivity, options);
};
