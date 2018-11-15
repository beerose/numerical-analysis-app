export interface ApiResponse {
  message?: string;
  error?: string;
}

export const ROUTES = {
  ACCOUNTS: {
    login: '/accounts/login',
    new: '/accounts/new',
  },
  GROUPS: {
    upload: '/groups/upload',
  },
  USERS: {
    add: '/users/add',
    delete: '/users/delete',
    list: '/users',
    update: '/users/update',
  },
};

export type UserDTO = {
  id?: string;
  user_name: string;
  email: string;
  student_index?: string;
  user_role: string;
};

export type Pagination = {
  offset: number;
  limit: number;
};
