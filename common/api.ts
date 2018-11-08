export interface ApiResponse {
  message?: string;
  error?: string;
}

export const ROUTES = {
  USERS: {
    list: "/users/",
    add: "/users/add/",
    update: "/users/update/",
    delete: "/users/delete/",
  },
};

export type UserDTO = {
  id?: string;
  user_name?: string;
  email?: string;
  student_index?: string;
  user_role?: string;
};
