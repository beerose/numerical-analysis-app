import { ServerRoutes } from 'common';

import { UserRole } from '../../../../../dist/common';
import { generateUserJwtToken } from '../../../src/lib';
import { fetch } from '../../fetch';

const user = {
  email: 'mad@max.com',
  user_name: 'Mad Max',
  user_role: UserRole.admin,
};

describe('AUTH: create account', () => {
  it('creates new user, creates new account', async () => {
    await fetch
      .asAdmin(ServerRoutes.Users.Create, {
        body: JSON.stringify(user),
        method: 'POST',
      })
      .expectStatus(200);

    const token = generateUserJwtToken(user);

    await fetch(ServerRoutes.Accounts.New, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      // tslint:disable-next-line:object-literal-sort-keys
      body: JSON.stringify({
        token,
        // tslint:disable-next-line:no-hardcoded-credentials
        password: 'password',
      }),
    })
      .expectStatus(200)
      .then(res => res.json())
      .then(console.log);
  });
});
