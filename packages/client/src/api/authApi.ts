import {
  ApiResponse,
  ServerRoutes,
  UserDTO,
  UserPrivileges,
  UserRole,
} from 'common';

import { SERVER_URL } from '.';
import { authFetch } from './authFetch';

const { Accounts } = ServerRoutes;

type AuthResponse = {
  token: string;
  user: UserDTO;
  privileges?: UserPrivileges;
};

const handleResponse = (response: ApiResponse | AuthResponse) => {
  if ('error' in response) {
    return response;
  }
  if ('token' in response && response.user) {
    return response;
  }
  return { error: 'Zła odpowiedź z serwera' };
};

const handleServerError = (err: any) => {
  if (!err.response) {
    return { error: JSON.stringify(err) };
  }
  return { error: err.response.data.message };
};

export const login = (email: string, password: string) => {
  // TODO: Dlaczego nie robimy JSON.stringify({ email, password })? To jest post przecież.
  // Te funkcje też są prawie takie same.

  const data = new URLSearchParams();
  data.append('email', email);
  data.append('password', password);
  return fetch(SERVER_URL + Accounts.Login, {
    body: data.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
    .then(response => response.json())
    .then(handleResponse)
    .catch(handleServerError);
};

export const newAccount = (token: string, password: string) => {
  const data = new URLSearchParams();
  data.append('token', token);
  data.append('password', password);
  return fetch(SERVER_URL + Accounts.New, {
    body: data.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
    .then(response => response.json())
    .then(handleResponse)
    .catch(handleServerError);
};

export const changePassword = (newPassword: string) => {
  return authFetch(SERVER_URL + Accounts.ChangePassword, {
    body: JSON.stringify({ new_password: newPassword }),
    method: 'POST',
  });
};
