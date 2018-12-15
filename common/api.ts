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
    add_meetings: '/groups/meetings.add',
    add_student: '/groups/students.add',
    delete_student: '/groups/students.delete',
    details: '/groups/:id',
    list: '/groups',
    list_meetings: 'groups/meetings',
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
  academic_year?: string;
  class?: number;
  data?: Record<string, any>;
};

export enum GroupEnum {
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
