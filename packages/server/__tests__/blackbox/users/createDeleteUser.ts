import { ServerRoutes } from 'common';

import { UserDTO, UserRole } from '../../../../../dist/common';
import { fetch } from '../../fetch';

describe('users', () => {
  it('creates, finds and deletes an admin', async () => {
    await fetch
      .asAdmin(ServerRoutes.Users.Create, {
        body: JSON.stringify({
          email: 'jon@doe.com',
          user_name: 'Jon Doe',
          user_role: UserRole.admin,
        } as UserDTO),
        method: 'POST',
      })
      .expectStatus(200);

    const userId = await fetch
      .asAdmin('/users?roles=admin')
      .expectStatus(200)
      .then(res => res.json())
      .then((res: { users: UserDTO[] }) => {
        const user = res.users.find(
          (u: UserDTO) =>
            u.user_name === 'Jon Doe' && u.user_role === UserRole.admin
        );

        expect(user).toBeTruthy();
        expect(user && user.user_name).toBe('Jon Doe');
        // tslint:disable-next-line:no-shadowed-variable
        return user && user.id;
      });

    await fetch
      .asAdmin(ServerRoutes.Users.Delete, {
        body: JSON.stringify({
          id: userId,
        }),
        method: 'DELETE',
      })
      .expectStatus(200);
  });
});
