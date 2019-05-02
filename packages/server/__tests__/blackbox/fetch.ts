import { UserRole } from 'common';
import {
  FetchFunction,
  makeFetch,
  Request,
  RequestInit,
} from 'supertest-fetch';

import { generateUserJwtToken } from '../../src/lib';
import { app } from '../../src/server';

interface TestFetchFunc extends FetchFunction {
  asAdmin: FetchFunction;
}

export const fetch: TestFetchFunc = makeFetch(app) as TestFetchFunc;

fetch.asAdmin = (url: string | Request, init?: RequestInit) =>
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
