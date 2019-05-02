import { UserRole } from 'common';
import {
  FetchFunction,
  makeFetch,
  Request,
  RequestInit,
} from 'supertest-fetch';

import { generateUserJwtToken } from '../src/lib';
import { app } from '../src/server';

export const fetch = makeFetch(app);

export const authFetchAdmin: FetchFunction = (
  url: string | Request,
  init?: RequestInit
) => {
  return fetch(url, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization:
        // tslint:disable-next-line:prefer-template
        'Bearer ' +
        generateUserJwtToken({
          email: 'admin@test.com',
          user_name: 'Test Admin User',
          user_role: UserRole.admin,
        }),
      'Content-Type': 'application/json',
    },
    ...init,
  });
};
