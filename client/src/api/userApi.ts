import * as qs from 'query-string';

import { ROUTES, UserDTO } from '../../../common/api';
import { showMessage } from '../utils/message';

import { SERVER_URL } from './urls';

const { USERS } = ROUTES;

export const listUsers = async (
  search_param: string | undefined,
  roles: string[] | undefined
): Promise<{ users: UserDTO[] }> => {
  const response = await fetch(
    `${SERVER_URL}${ROUTES.USERS.list}?${qs.stringify({
      search_param,
      role: roles,
    })}`,
    {
      method: 'GET',
    }
  );
  return response.json();
};

export const addUser = async (user: UserDTO) => {
  const response = await fetch(SERVER_URL + USERS.add, {
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  response.json().then(res => showMessage(res));
};

export const deleteUser = async (id: string) => {
  const response = await fetch(SERVER_URL + USERS.delete, {
    body: JSON.stringify({ id }),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  });
  response.json().then(res => showMessage(res));
};

export const updateUser = async (user: UserDTO) => {
  const response = await fetch(SERVER_URL + USERS.update, {
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  response.json().then(res => showMessage(res));
};
