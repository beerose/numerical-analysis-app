// tslint:disable: object-literal-sort-keys
import { UserDTO, UserPrivileges, UserRole } from 'common';
import createStore from 'zustand';

/**
 * TODO: GET USER ID FROM THE BACKEND
 */

import * as authService from './api/authApi';
import { userInCookies } from './userInCookies';
import * as zustandDevtools from './utils/zustandDevtools';

const hoursFromNow = (expirationHours: number) => {
  const now = new Date();
  return now.setHours(now.getHours() + expirationHours);
};

export const [useAuthStore, authStore] = createStore(set => ({
  errorMessage: undefined as string | undefined,
  token: undefined as string | undefined,
  user: undefined as UserDTO | undefined,
  privileges: undefined as UserPrivileges | undefined,
  ...userInCookies.get(),
  actions: {
    changePassword: authService.changePassword,
    createNewAccount: (token: string, password: string) => {
      authService
        .newAccount(token, password)
        .then(res => {
          if ('error' in res) {
            throw new Error(res.error);
          }

          // tslint:disable-next-line:no-shadowed-variable
          const { token, user_name, user_role } = res;

          console.log('>>', { res });

          userInCookies.set(
            {
              token,
              user: { user_name, user_role },
            },
            hoursFromNow(24)
          );

          set({
            token,
            user: res,
          });

          return res;
        })
        .catch(err => {
          set({ errorMessage: err.message });
        });
    },
    logout: () => {
      userInCookies.clear();

      set({ user: undefined });
    },
    login: (email: string, password: string, remember: boolean) => {
      authService
        .login(email, password)
        .then(res => {
          if ('error' in res) {
            throw new Error(res.error);
          }

          const { token, user_name, user_role, privileges } = res;

          userInCookies.set(
            {
              token,
              user: { user_name, user_role },
            },
            hoursFromNow(remember ? 24 : 7)
          );

          set({
            privileges,
            token: res.token,
            user: { user_name, user_role },
            errorMessage: '',
          });

          return res;
        })
        .catch((err: Error) => {
          set({ errorMessage: err.message });
        });
    },
  },
}));

export type AuthStoreState = ReturnType<typeof authStore.getState>;

if (process.env.NODE_ENV === 'development') {
  zustandDevtools.mountStoreSinkDevtool('AuthStore', authStore);
}
