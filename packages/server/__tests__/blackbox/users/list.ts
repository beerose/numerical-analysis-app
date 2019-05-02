import { ServerRoutes } from 'common';

import { fetch } from '../../fetch';

describe('users', () => {
  describe(`get ${ServerRoutes.Users.List}`, () => {
    it('responds with 200', async () =>
      fetch.asAdmin('/users').expectStatus(200));
  });
});
