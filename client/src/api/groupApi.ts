import { ROUTES, UserDTO } from '../../../common/api';

import { SERVER_URL } from '.';

const { GROUPS } = ROUTES;

export const uploadUsers = async (fileContent: string): Promise<{ message: UserDTO[] }> => {
  // TO DO
  const response = await fetch(SERVER_URL + GROUPS.upload, {
    body: JSON.stringify({ data: fileContent, group: 'test' }),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  return response.json();
};
