import * as qs from 'query-string';
import { Omit } from 'react-router';

import { GroupDTO, MeetingDTO, Routes, UserDTO } from '../../../common/api';
import { showMessage } from '../utils/message';

import { SERVER_URL } from '.';
import { authFetch } from './utils';

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

  return authFetch(SERVER_URL + Groups.Students.RemoveFromGroup, options).then(showMessage);
};

export const updateUserFromGroup = async (user: UserDTO) => {
  const options = {
    body: JSON.stringify({ ...user }),
    method: 'POST',
  };

  await authFetch(SERVER_URL + Groups.Students.UpdateStudent, options).then(showMessage);
};

export const addStudentToGroup = async (user: UserDTO, groupId: string) => {
  const options = {
    body: JSON.stringify({ user, group_id: groupId }),
    method: 'POST',
  };

  await authFetch(SERVER_URL + Groups.Students.AddToGroup, options).then(showMessage);
};

export const addGroup = (group: Omit<GroupDTO, 'id'>) => {
  const options = {
    body: JSON.stringify(group),
    method: 'POST',
  };

  return authFetch(SERVER_URL + Groups.Create, options);
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

export const listMeetings = (groupId: string): Promise<MeetingDTO[]> => {
  const options = {
    method: 'GET',
  };

  return authFetch<MeetingDTO[]>(
    `${SERVER_URL + Groups.Meetings.List}?${qs.stringify({ group_id: groupId })}`,
    options
  );
};
