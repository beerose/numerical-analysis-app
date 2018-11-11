import { ROUTES } from '../../../common/api';

import { SERVER_URL } from '.';

const { GROUPS } = ROUTES;

export const uploadUsers = async (fileContent: string) => {
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
