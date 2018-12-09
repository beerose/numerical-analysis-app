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
    add_student: '/groups/students.add',
    delete_student: '/groups/students.delete',
    details: '/groups/:id',
    list: '/groups',
    students: '/groups/students.get',
    update_student: '/groups/students.update',
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

export type GroupDTO = {
  id: string;
  group_name: string;
  group_type: GroupEnum;
  lecturer: string;
  academic_year: string;
  class: number;
  data: Record<string, any>;
};

export enum GroupEnum {
  Exercise = 'Ćwiczenia',
  Lab = 'Pracownia',
  Lecture = 'Wykład',
}
