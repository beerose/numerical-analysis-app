import { ServerRoutes } from 'common';

import { UserDTO, UserRole } from '../../../../../dist/common';
import { fetch } from '../../../__testUtils__/fetch';

describe('USERS', async () => {
  await it('GET: should respond with users list', () =>
    fetch.asAdmin('/users').expectStatus(200));

  await it('can create a new admin', () => {
    return fetch
      .asAdmin(ServerRoutes.Users.Create, {
        body: JSON.stringify({
          email: 'jon@doe.com',
          user_name: 'Jon Doe',
          user_role: UserRole.admin,
        } as UserDTO),
        method: 'POST',
      })
      .expectStatus(200);
  });

  let userId: number;
  it('should respond with newly created admin', () =>
    fetch
      .asAdmin('/users?roles=admin')
      .expectStatus(200)
      .then(res => res.json(), fail)
      .then((res: { users: UserDTO[] }) => {
        const user = res.users.find(
          (u: UserDTO) =>
            u.user_name === 'Jon Doe' && u.user_role === UserRole.admin
        );
        userId = user.id;
        expect(user).toBeTruthy();
      }, fail));

  it('can delete created user', () =>
    fetch
      .asAdmin(ServerRoutes.Users.Delete, {
        body: JSON.stringify({
          id: userId,
        }),
        method: 'DELETE',
      })
      .expectStatus(200));
});
