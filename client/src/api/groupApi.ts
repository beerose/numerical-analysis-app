import { ROUTES } from '../../../common/api';

import { SERVER_URL } from '.';

const { GROUPS } = ROUTES;

export const uploadUsers = async (base64file: string) => {
  const response = await fetch(SERVER_URL + GROUPS.upload, {
    body: JSON.stringify({ data: base64file }),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  return response.json();
};
