import * as qs from 'query-string';

import { GroupDTO, ROUTES, UserDTO } from '../../../common/api';

import { SERVER_URL } from '.';
import { authFetch } from './utils';

const { GROUPS } = ROUTES;

export const uploadUsers = async (fileContent: string): Promise<{ message: UserDTO[] }> => {
  const options = {
    body: JSON.stringify({ data: fileContent, group: 'test' }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };

  return authFetch<{ message: UserDTO[] }>(SERVER_URL + GROUPS.upload, options);
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
