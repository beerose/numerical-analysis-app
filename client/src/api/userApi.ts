import * as qs from 'query-string';

import { Routes, UserDTO } from '../../../common/api';
import { showMessage } from '../utils/message';

import { SERVER_URL } from './';
import { authFetch } from './authFetch';

const { Users } = Routes;

const LIMIT = 10;

export const listUsers = async ({
  searchParam,
  roles,
  currentPage = 1,
}: {
  searchParam?: string;
  roles?: string[] | string;
  currentPage?: number;
}): Promise<{ users: UserDTO[]; total: string }> => {
  const options: RequestInit = {
    method: 'GET',
  };

  const queryParams = qs.stringify({
    roles,
    limit: LIMIT,
    offset: (currentPage - 1) * LIMIT,
    search_param: searchParam,
  });

  return authFetch<{ users: UserDTO[]; total: string }>(
    `${SERVER_URL}${Users.List}?${queryParams}`,
    options
  );
};

export const addUser = async (user: UserDTO) => {
  const options = {
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };
  await authFetch(SERVER_URL + Users.Create, options).then(res => showMessage(res));
};

export const deleteUser = async (id: string) => {
  const options = {
    body: JSON.stringify({ id }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'DELETE',
  };

  await authFetch(SERVER_URL + Users.Delete, options).then(showMessage);
};

export const updateUser = async (user: UserDTO) => {
  const options = {
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };

  await authFetch(SERVER_URL + Users.Update, options).then(showMessage);
};
