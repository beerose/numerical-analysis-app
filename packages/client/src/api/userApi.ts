import { ApiResponse, ServerRoutes, UserDTO, UserId } from 'common';

import { showMessage } from '../utils/showMessage';

import { SERVER_URL } from './';
import { authFetch, authFetch2 } from './authFetch';

const { Users } = ServerRoutes;

const LIMIT = 10;

export const getUser = (userId: UserId) =>
  authFetch2<UserDTO>(SERVER_URL + Users.Get(userId));

export const listUsers = async ({
  searchParam,
  roles,
  currentPage = 1,
  limit,
}: {
  searchParam?: string;
  roles?: string[] | string;
  currentPage?: number;
  limit?: boolean;
}) => {
  return authFetch2<{ users: UserDTO[]; total: string }>(
    `${SERVER_URL}${Users.List}`,
    {
      query: {
        roles,
        limit: limit ? LIMIT : undefined,
        offset: limit ? (currentPage - 1) * LIMIT : undefined,
        search_param: searchParam,
      },
    }
  );
};

export const addUser = async (user: UserDTO) => {
  await authFetch<ApiResponse>(SERVER_URL + Users.Create, {
    body: JSON.stringify(user),
    method: 'POST',
  }).then(showMessage);
};

export const deleteUser = async (id: UserId) => {
  const options = {
    body: JSON.stringify({ id }),
    method: 'DELETE',
  };

  await authFetch<ApiResponse>(SERVER_URL + Users.Delete, options).then(
    showMessage
  );
};

export const updateUser = (user: UserDTO) => {
  return authFetch<ApiResponse>(SERVER_URL + Users.Update, {
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  }).then(showMessage);
};

export const sendInvitation = (
  payload: Pick<UserDTO, 'email' | 'user_name' | 'user_role'>
) => {
  return authFetch<ApiResponse>(SERVER_URL + Users.SendInvitation, {
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  }).then(showMessage);
};
