import { ApiResponse, ServerRoutes } from 'common';

import { LABELS } from '../utils/labels';

import { SERVER_URL } from '.';
import { authFetch } from './authFetch';

const { Accounts } = ServerRoutes;

type AuthResponse = {
  token: string;
  user_name: string;
  user_role: string;
};

const handleWrongResponse = (response: ApiResponse | AuthResponse) => {
  if ('error' in response) {
    return response;
  }
  if ('token' in response && !response.user_name && response.user_role) {
    return response;
  }
  return { error: 'Zła odpowiedź z serwera' };
};

const handleServerError = (err: any) => {
  if (!err.response) {
    return { error: LABELS.serverUnavaliable };
  }
  return { error: err.response.data.message };
};

export const login = (
  email: string,
  password: string
): Promise<
  { token: string; user_name: string; user_role: string } | { error: string }
> => {
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
    .then(handleWrongResponse)
    .catch(handleServerError);
};

export const newAccount = (
  token: string,
  password: string
): Promise<
  { token: string; user_name: string; user_role: string } | { error: string }
> => {
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
    .then(handleWrongResponse)
    .catch(handleServerError);
};

export const changePassword = (newPassword: string) => {
  return authFetch(SERVER_URL + Accounts.ChangePassword, {
    body: JSON.stringify({ new_password: newPassword }),
    method: 'POST',
  });
};
