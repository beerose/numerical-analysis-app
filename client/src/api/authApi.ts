import { ApiResponse, ROUTES } from '../../../common/api';

import { SERVER_URL } from '.';

const { ACCOUNTS } = ROUTES;

export const login = async (
  username: string,
  password: string
): Promise<{ token?: string; user_name?: string; user_role?: string } & ApiResponse> => {
  const data = new URLSearchParams();
  data.append('username', username);
  data.append('password', password);
  const response = await fetch(SERVER_URL + ACCOUNTS.login, {
    body: data.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
  return response.json();
};
