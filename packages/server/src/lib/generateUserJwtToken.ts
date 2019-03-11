import { UserRole } from 'common';
import jwt from 'jsonwebtoken';

console.assert(process.env.JWT_SECRET, 'process.env.JWT_SECRET must be set');

export const generateUserJwtToken = (
  email: string,
  userName: string,
  userRole: UserRole
) => {
  return jwt.sign(
    { email, user_role: userRole, user_name: userName },
    // tslint:disable-next-line:no-non-null-assertion // asserted above
    process.env.JWT_SECRET!
  );
};
