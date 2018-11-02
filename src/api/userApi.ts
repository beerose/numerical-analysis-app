import * as qs from 'query-string';
import { ListUsersResponseDTO, UserDTO } from './userApiDTO';
import { SERVER_URL } from './urls';

enum UserApiRoutes {
  List = '/users/',
  Add = '/users/add/',
  Update = '/users/update/',
  Delete = '/users/delete/',
}

export const listUsers = async (
  search_param: string | undefined,
  roles: string[] | undefined
): Promise<ListUsersResponseDTO> => {
  const response = await fetch(
    SERVER_URL +
      UserApiRoutes.List +
      qs.stringify({
        search_param: search_param,
        role: roles,
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
