import { ServerRoutes } from 'common';

import { UserDTO, UserRole } from '../../../../../dist/common';
import { authFetchAdmin, fetch } from '../fetch';

describe('USERS', async () => {
  await it('GET: should respond with users list', () =>
    authFetchAdmin('/users').expectStatus(200));

  await it('can create a new admin', () => {
    return authFetchAdmin(ServerRoutes.Users.Create, {
      body: JSON.stringify({
        email: 'jon@doe.com',
        user_name: 'Jon Doe',
        user_role: UserRole.admin,
      } as UserDTO),
      method: 'POST',
    }).expectStatus(200);
  });

  // await it('should respond with newly created admin', () =>
  //   authFetchAdmin('/users?roles=admin')
  //     .expectStatus(200)
  //     .then(res => res.json(), fail)
  //     .then((res: { users: UserDTO[] }) => {
  //       expect(
  //         res.users.filter(
  //           (u: UserDTO) =>
  //             u.user_name === 'Jon Doe' && u.user_role === UserRole.admin
  //         )
  //       ).toHaveLength(1);
  //     }, fail));
});
