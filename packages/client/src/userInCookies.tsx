import { UserDTO, UserRole } from 'common';
import Cookies from 'js-cookie';

type UserCookieObject = {
  token: string;
  user: UserDTO;
};

export const userInCookies = {
  get() {
    const token = Cookies.get('token');
    const user = Cookies.getJSON('user') as Partial<UserDTO>;

    if (!user || !token || !user.user_name || !user.user_role) {
      return;
    }

    UserRole.assert(user.user_role);
    return user;
  },
  set(uco: UserCookieObject, expires: number) {
    const options = { expires };

    Cookies.set('token', uco.token, options);
    Cookies.set('user', uco.user, options);
  },
  clear() {
    Cookies.remove('user');
    Cookies.remove('token');
  },
};
