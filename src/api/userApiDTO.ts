export type UserDTO = {
  user_name?: string;
  email?: string;
  index?: string;
  user_role?: string;
};

export type ListUsersRequestDTO = {
  search_param?: string;
  role?: string;
};
export type ListUsersResponseDTO = {
  users: UserDTO[];
};
