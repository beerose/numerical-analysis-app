// tslint:disable: object-literal-sort-keys
import { UserDTO, UserPrivileges, UserRole } from 'common';
import createStore from 'zustand';

import * as authService from './api/authApi';
import { userInCookies } from './userInCookies';
import { showMessage } from './utils';
import * as zustandDevtools from './utils/zustandDevtools';

const hoursFromNow = (expirationHours: number) => {
  const now = new Date();
  return now.setHours(now.getHours() + expirationHours);
};

/**
 * Prefer importing `useAuthStore` over `authStore`.
 * Import authStore only in tests.
 */
export const [useAuthStore, authStore] = createStore(set => ({
  errorMessage: undefined as string | undefined,
  token: undefined as string | undefined,
  user: undefined as UserDTO | undefined,
  ...userInCookies.get(),
  actions: {
    resetError: () => {
      set({ errorMessage: null });
    },
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
          console.error(err);
          set({ errorMessage: err.error || err.message });
        });
    },
    logout: () => {
      userInCookies.clear();

      set({ user: undefined });
    },
    resetPassword: (email: string) => {
      return authService
        .resetPassword(email)
        .then(res => {
          if ('error' in res) {
            throw new Error(res.error);
          }
          set({ errorMessage: '' });
          showMessage(res);
          return res;
        })
        .catch(res => {
          set({ errorMessage: res.error || res.message });
          return { error: res.error };
        });
    },
    login: (email: string, password: string, remember: boolean) => {
      return authService
        .login(email, password)
        .then(res => {
          if ('error' in res) {
            throw new Error(res.error);
          }

          const { token, user } = res;

          userInCookies.set({ token, user }, hoursFromNow(remember ? 24 : 7));

          set({
            user,
            token,
            errorMessage: '',
          });

          return res;
        })
        .catch(res => {
          console.error(res);
          set({ errorMessage: res.error || res.message });
          return { error: res.error };
        });
    },
  },
}));

export type AuthStoreState = ReturnType<typeof authStore.getState>;

if (process.env.NODE_ENV === 'development') {
  zustandDevtools.mountStoreSinkDevtool('AuthStore', authStore);
}
