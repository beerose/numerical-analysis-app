import {
  makeFetch,
  FetchFunction,
  Request,
  RequestInit,
} from 'supertest-fetch';

import { app } from '../../src/server';
import { generateUserJwtToken } from '../../src/lib';
import { UserRole } from 'common';

export const fetch = makeFetch(app);

export const authFetchAdmin: FetchFunction = (
  url: string | Request,
  init?: RequestInit
) =>
  fetch(url, {
    ...init,
    headers: {
      Authorization:
        'Bearer ' +
        generateUserJwtToken({
          email: 'admin@test.com',
          user_name: 'Test Admin User',
          user_role: UserRole.admin,
        }),
    },
  });
