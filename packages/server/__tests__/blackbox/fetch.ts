import { makeFetch, FetchFunction } from 'supertest-fetch';

import { app } from '../../src/server';
import { generateUserJwtToken } from '../../src/lib';
import { UserRole } from 'common';

export const fetch = makeFetch(app);

export const authFetchAdmin: FetchFunction = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: generateUserJwtToken({
        email: 'admin@test.com',
        user_name: 'Test Admin User',
        user_role: UserRole.admin,
      }),
    },
  });
