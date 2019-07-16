import {
  ApiResponse,
  ServerRoutes,
  UserDTO,
  UserPrivileges,
  UserRole,
} from 'common';

import { SERVER_URL } from '.';
import { authFetch, authFetch2 } from './authFetch';

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
    return { error: err instanceof Error ? err : JSON.stringify(err) };
  }
  return { error: err.response.data.message };
};

export const login = (email: string, password: string) => {
  // Dlaczego nie robimy JSON.stringify({ email, password })? To jest post przecież.
  // Te funkcje też są prawie takie same.
  // ODPOWIEDŹ: Tak polecają ludzie na stackoverflow

  const data = new URLSearchParams();
  data.append('email', email);
  data.append('password', password);
  return fetch(SERVER_URL + Accounts.Login, {
    body: data.toString(),
    headers: {
      // tslint:disable-next-line:no-duplicate-string
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
    .then(async res => {
      const json = await res.json();
      return json.error
        ? {
            error: json.error,
            error_details: json.error_details,
            status: res.status,
          }
        : { ...json };
    })
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

export const changePassword = (
  newPassword: string,
  headers?: RequestInit['headers']
) => {
  return authFetch2(SERVER_URL + Accounts.ChangePassword, {
    headers,
    body: JSON.stringify({ new_password: newPassword }),
    method: 'POST',
  });
};

export const resetPassword = (email: UserDTO['email']) =>
  fetch(SERVER_URL + Accounts.ResetPassword, {
    body: JSON.stringify({ email }),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then(response => response.json())
    .catch(handleServerError);
