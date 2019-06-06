import { ApiResponse, GroupDTO, ServerRoutes, UserDTO } from 'common';
import * as qs from 'query-string';

import { showMessage } from '../utils/showMessage';

import { SERVER_URL } from './';
import { authFetch } from './authFetch';

const { Users } = ServerRoutes;

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
  await authFetch<ApiResponse>(SERVER_URL + Users.Create, {
    body: JSON.stringify(user),
    method: 'POST',
  }).then(showMessage);
};

export const deleteUser = async (id: UserDTO['id']) => {
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

export const getStudentGroups = (userId: UserDTO['id']) =>
  authFetch<{ groups: GroupDTO[] }>(SERVER_URL + Users.Student.Groups(userId));
