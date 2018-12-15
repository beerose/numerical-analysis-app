import * as qs from 'query-string';
import { Omit } from 'react-router';

import { GroupDTO, ROUTES, UserDTO } from '../../../common/api';
import { showMessage } from '../utils/message';

import { SERVER_URL } from '.';
import { authFetch } from './utils';

const { GROUPS } = ROUTES;

export const uploadUsers = async (fileContent: string, groupId: string) => {
  const options = {
    body: JSON.stringify({ data: fileContent, group_id: groupId }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };

  await authFetch<{ message: string }>(SERVER_URL + GROUPS.upload, options).then(showMessage);
};

export const listGroups = async (): Promise<{ groups: GroupDTO[] }> => {
  const options = {
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'GET',
  };

  return authFetch<{ groups: GroupDTO[] }>(SERVER_URL + GROUPS.list, options);
};

export const listStudentsForGroup = async (groupId: string): Promise<{ students: UserDTO[] }> => {
  const options = {
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'GET',
  };

  return authFetch<{ students: UserDTO[] }>(
    `${SERVER_URL + GROUPS.students}?${qs.stringify({ group_id: groupId })}`,
    options
  );
};

export const deleteUserFromGroup = async (userId: string) => {
  const options = {
    body: JSON.stringify({ user_id: userId }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'DELETE',
  };

  return authFetch(SERVER_URL + GROUPS.delete_student, options).then(showMessage);
};

export const updateUserFromGroup = async (user: UserDTO) => {
  const options = {
    body: JSON.stringify({ ...user }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };

  await authFetch(SERVER_URL + GROUPS.update_student, options).then(showMessage);
};

export const addStudentToGroup = async (user: UserDTO, groupId: string) => {
  const options = {
    body: JSON.stringify({ user, group_id: groupId }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };

  await authFetch(SERVER_URL + GROUPS.add_student, options).then(showMessage);
};

export const addGroup = (group: Omit<GroupDTO, 'id'>) => {
  return authFetch(SERVER_URL + GROUPS.add, {
    body: JSON.stringify(group),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  });
};
