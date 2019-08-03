// tslint:disable: object-literal-sort-keys
import { UserDTO } from 'common';
import * as zustandDevtools from 'simple-zustand-devtools';
import createStore, { SetState } from 'zustand';

import * as authService from './api/authApi';
import { userInCookies } from './userInCookies';
import { showMessage } from './utils';

const hoursFromNow = (expirationHours: number) => {
  const now = new Date();
  return now.setHours(now.getHours() + expirationHours);
};

/**
 * This will change during the runtime of the application
 */
type State = {
  errorMessage?: string;
  token?: string;
  user?: UserDTO;
};

const initialState: State = {
  errorMessage: undefined,
  token: undefined,
  user: undefined,
};

/**
 * Actions won't change
 */
function makeActions(set: SetState<State>) {
  return {
    resetError: () => {
      set({ errorMessage: undefined });
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

      set(initialState);
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
  };
}

/**
 * Prefer importing `useAuthStore` over `authStore`.
 * Import authStore only in tests.
 */
export const [useAuthStore, authStore] = createStore((
  set: any /* this is on purpose
              we want to infer store type,
              and typing `set` makes it impossible */
) => {
  return {
    ...initialState,
    ...userInCookies.get(),
    actions: makeActions(set),
  };
});

export type AuthStoreState = ReturnType<typeof authStore.getState>;

if (process.env.NODE_ENV === 'development') {
  zustandDevtools.mountStoreDevtool('AuthStore', authStore);
}
