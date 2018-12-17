import * as qs from 'query-string';

import { ROUTES, UserDTO } from '../../../common/api';
import { showMessage } from '../utils/message';

import { SERVER_URL } from './';
import { authFetch } from './utils';

const { USERS } = ROUTES;

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
    `${SERVER_URL}${ROUTES.USERS.list}?${queryParams}`,
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
  await authFetch(SERVER_URL + USERS.create, options).then(res => showMessage(res));
};

export const deleteUser = async (id: string) => {
  const options = {
    body: JSON.stringify({ id }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'DELETE',
  };

  await authFetch(SERVER_URL + USERS.delete, options).then(res => showMessage(res));
};

export const updateUser = async (user: UserDTO) => {
  const options = {
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };

  await authFetch(SERVER_URL + USERS.update, options).then(res => showMessage(res));
};
