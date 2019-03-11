import { UserDTO } from 'common';
import jwt from 'jsonwebtoken';

console.assert(process.env.JWT_SECRET, 'process.env.JWT_SECRET must be set');

export type UserJwtTokenPayload = Pick<
  UserDTO,
  'email' | 'user_name' | 'user_role'
>;

export const generateUserJwtToken = (tokenPayload: UserJwtTokenPayload) => {
  return jwt.sign(
    tokenPayload,
    // tslint:disable-next-line:no-non-null-assertion // asserted above
    process.env.JWT_SECRET!
  );
};
