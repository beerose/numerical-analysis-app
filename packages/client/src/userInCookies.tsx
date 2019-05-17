import { UserDTO, UserRole } from 'common';
import Cookies from 'js-cookie';
type UserCookieObject = {
  userName: UserDTO['user_name'];
  userRole: UserDTO['user_role'];
  token: string;
};

export const userInCookies = {
  get() {
    // TODO: Save json to Cookies ?
    const token = Cookies.get('token');
    const userName = Cookies.get('user_name');
    const userRole = Cookies.get('user_role');
    if (!token || !userName || !userRole) {
      return;
    }
    return {
      userName,
      userAuth: true,
      userRole: UserRole.assert(userRole),
    };
  },
  set(user: UserCookieObject, expires: number) {
    const options = { expires };
    Cookies.set('user_role', user.userRole, options);
    Cookies.set('user_name', user.userName, options);
    Cookies.set('token', user.token, options);
  },
  clear() {
    Cookies.remove('user_role');
    Cookies.remove('user_name');
    Cookies.remove('token');
  },
};
