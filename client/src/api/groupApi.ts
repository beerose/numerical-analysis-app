import { ROUTES, UserDTO } from '../../../common/api';

import { SERVER_URL } from '.';
import { authFetch } from './utils';

const { GROUPS } = ROUTES;

export const uploadUsers = async (fileContent: string): Promise<{ message: UserDTO[] }> => {
  const options = {
    body: JSON.stringify({ data: fileContent, group: 'test' }),
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
    method: 'POST',
  };

  return authFetch<{ message: UserDTO[] }>(SERVER_URL + GROUPS.upload, options);
};
