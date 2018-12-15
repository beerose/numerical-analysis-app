import { GROUPS } from './groups';

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
    add: '/groups/add',
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
  group_type: GROUPS;
  academic_year?: string;
  // tslint:disable-next-line:no-reserved-keywords
  class?: string;
  data?: Record<string, unknown>;
};

export enum GroupEnumUI { // TODO: Move this to component / presentational helper or sth like that
  Exercise = 'Ćwiczenia',
  Lab = 'Pracownia',
  Lecture = 'Wykład',
}

export type MeetingDTO = {
  id: number;
  meeting_name: string;
  date: string; // TODO: ?
  group_id?: number;
  created_at?: number; // TODO: timestamp?
  updated_at?: number; // TODO: timestamp?
};
