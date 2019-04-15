import { fetch, authFetchAdmin } from '../fetch';
import { UserDTO, UserRole } from '../../../../../dist/common';

describe('get /users', () => {
  it('should respond with users list', () =>
    authFetchAdmin('/users').expectStatus(200));

  it('should respond with admins list', () =>
    authFetchAdmin('/users?roles=admin')
      .expectStatus(200)
      .then(res => res.json(), fail)
      .then((res: { users: UserDTO[] }) => {
        expect(
          res.users.filter(
            (u: UserDTO) =>
              u.user_role === UserRole.student ||
              u.user_role === UserRole.superUser
          )
        ).toHaveLength(0);
      }, fail));
});
