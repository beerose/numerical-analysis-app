import * as qs from 'query-string';
import { SERVER_URL } from './urls';
import {
  ListUsersRequestDTO,
  ListUsersResponseDTO,
  UserDTO,
} from './userApiDTO';

enum UserApiRoutes {
  List = '/users',
  Add = '/users/add',
  Update = '/users/update',
  Delete = '/users/delete',
}

export const listUsers = async ({
  search_param,
  role,
}: ListUsersRequestDTO): Promise<ListUsersResponseDTO> => {
  const response = await fetch(
    SERVER_URL +
      UserApiRoutes.List +
      qs.stringify({
        search_param,
        role,
      }),
    {
      method: 'GET',
    }
  );
  return response.json();
};

export const addUser = async (user: UserDTO): Promise<void> => {
  const response = await fetch(SERVER_URL + UserApiRoutes.Add, {
    method: 'POST',
    body: JSON.stringify(user),
  });
  return response.json();
};

export const deleteUser = async (email: string): Promise<void> => {
  const response = await fetch(
    SERVER_URL + UserApiRoutes.Delete + qs.stringify({ email }),
    {
      method: 'GET',
    }
  );
  return response.json();
};

export const updateUser = async (user: UserDTO): Promise<void> => {
  const response = await fetch(SERVER_URL + UserApiRoutes.Update, {
    method: 'POST',
    body: JSON.stringify(user),
  });
  return response.json();
};
