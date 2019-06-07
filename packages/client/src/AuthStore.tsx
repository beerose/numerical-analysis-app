// tslint:disable: object-literal-sort-keys
import { UserDTO, UserPrivileges, UserRole } from 'common';
import createStore from 'zustand';

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
          const { token, user } = res;
          userInCookies.set({ token, user }, hoursFromNow(24));
          set({ token, user });

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
      return authService
        .login(email, password)
        .then(res => {
          if ('error' in res) {
            throw new Error(res.error);
          }

          const { token, user, privileges } = res;

          userInCookies.set({ token, user }, hoursFromNow(remember ? 24 : 7));

          set({
            user,
            privileges,
            token,
            errorMessage: '',
          });

          return res;
        })
        .catch((err: Error) => {
          set({ errorMessage: err.message });
          return { error: Error };
        });
    },
  },
}));

export type AuthStoreState = ReturnType<typeof authStore.getState>;

if (process.env.NODE_ENV === 'development') {
  zustandDevtools.mountStoreSinkDevtool('AuthStore', authStore);
}
