// tslint:disable: object-literal-sort-keys
import { UserRole } from 'common';
import createStore from 'zustand';

import * as authService from './api/authApi';
import { userInCookies } from './userInCookies';

const hoursFromNow = (expirationHours: number) => {
  const now = new Date();
  return now.setHours(now.getHours() + expirationHours);
};

export const [useAuthStore] = createStore(set => ({
  error: false,
  errorMessage: undefined as string | undefined,
  token: undefined as string | undefined,
  userAuth: false,
  userName: undefined as string | undefined,
  userRole: undefined as UserRole | undefined,
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
          const { token, user_name: userName, user_role: userRole } = res;

          userInCookies.set(
            {
              token,
              userName,
              userRole: UserRole.assert(userRole),
            },
            hoursFromNow(24)
          );

          set({
            token,
            userName,
            userRole,
            userAuth: true,
          });

          return res;
        })
        .catch(err => {
          set({ error: true, errorMessage: err.message });
        });
    },
    logout: () => {
      userInCookies.clear();

      set({
        userAuth: false,
        userName: undefined,
        userRole: undefined,
      });
    },
    login: (email: string, password: string, remember: boolean) => {
      authService
        .login(email, password)
        .then(res => {
          if ('error' in res) {
            throw new Error(res.error);
          }

          const { token, user_name: userName, user_role: userRole } = res;

          userInCookies.set(
            {
              token,
              userName,
              userRole,
            },
            hoursFromNow(remember ? 24 : 7)
          );

          set({
            token: res.token,
            userAuth: true,
            userName: res.user_name,
            userRole: res.user_role,
          });
          return res;
        })
        .catch((err: Error) => {
          set({ error: true, errorMessage: err.message });
        });
    },
  },
}));

const _store = useAuthStore();
export type AuthStore = typeof _store;
