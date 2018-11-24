import { LABELS } from '../utils/labels';

import { ApiResponse, ROUTES } from '../../../common/api';

import { SERVER_URL } from '.';

const { ACCOUNTS } = ROUTES;

export const login = (
  email: string,
  password: string
): Promise<{ token: string; user_name: string; user_role: string } & ApiResponse> => {
  const data = new URLSearchParams();
  data.append('email', email);
  data.append('password', password);
  return fetch(SERVER_URL + ACCOUNTS.login, {
    body: data.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
    .then(response => response.json())
    .then(response => {
      if (!response.token || !response.user_name || !response.user_role) {
        return { error: 'Zła odpowiedź z serwera' };
      }
      return response;
    })
    .catch(err => {
      if (!err.response) {
        return { error: LABELS.serverUnavaliable };
      }
      return { error: err.response.data.message };
    });
};

export const newAccount = (
  token: string,
  password: string
): Promise<{ token: string; user_name: string; user_role: string } & ApiResponse> => {
  const data = new URLSearchParams();
  data.append('token', token);
  data.append('password', password);
  return fetch(SERVER_URL + ACCOUNTS.new, {
    body: data.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
    .then(response => response.json())
    .then(response => {
      if (!response.token || !response.user_name || !response.user_role) {
        return { error: 'Zła odpowiedź z serwera' };
      }
      return response;
    })
    .catch(err => {
      if (!err.response) {
        return { error: LABELS.serverUnavaliable };
      }
      return { error: err.response.data.message };
    });
};
