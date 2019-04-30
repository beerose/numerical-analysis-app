import { UserRole } from 'common';
import {
  FetchFunction,
  makeFetch,
  Request,
  RequestInit,
} from 'supertest-fetch';

import { generateUserJwtToken } from '../../src/lib';
import { app } from '../../src/server';

export const fetch = makeFetch(app);

export const authFetchAdmin: FetchFunction = (
  url: string | Request,
  init?: RequestInit
) =>
  fetch(url, {
    ...init,
    headers: {
      Authorization:
        // tslint:disable-next-line:prefer-template
        'Bearer ' +
        generateUserJwtToken({
          email: 'admin@test.com',
          user_name: 'Test Admin User',
          user_role: UserRole.admin,
        }),
    },
  });
