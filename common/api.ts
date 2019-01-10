export interface ApiResponse {
  message?: string;
  error?: string;
}

// TODO: function l<T extends string>(s: T): T;

export const ServerRoutes = {
  Accounts: {
    Login: '/accounts/login',
    New: '/accounts/new',
  },
  Groups: {
    Create: '/groups/create',
    Delete: '/groups/delete',
    Get: '/groups',
    List: '/groups',
    Meetings: {
      AddPresence: '/groups/meetings.addPresence',
      Create: '/groups/meetings.create',
      Delete: '/groups/meetings.delete',
      DeletePresence: '/groups/meetings.deletePresence',
      Details: '/groups/meetings.details',
      List: '/groups/meetings',
      SetActivity: '/groups/meetings.setActivity',
      Update: '/groups/meetings.update',
    },
    Students: {
      AddToGroup: '/groups/students.add',
      List: '/groups/students',
      RemoveFromGroup: '/groups/students.delete',
    },
    Upload: '/groups/upload',
  },
  Users: {
    Create: '/users/create',
    Delete: '/users/delete',
    List: '/users',
    Update: '/users/update',
  },
};

export enum UserRole {
  admin = 'admin',
  superUser = 'superUser',
  student = 'student',
}

export const userRoleOptions = Object.values(UserRole);

export type UserDTO = {
  id: string;
  user_name: string;
  email: string;
  student_index?: string;
  user_role: UserRole;
};

export type Pagination = {
  offset: number;
  limit: number;
};

export enum GroupType {
  LAB = 'lab',
  EXERCISE = 'exercise',
  LECTURE = 'lecture',
}

export type GroupDTO = {
  id: string;
  group_name: string;
  group_type: GroupType;
  academic_year?: string;
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
  date: string;
  group_id: number;
};

export type Student = Pick<UserDTO, 'id' | 'user_name' | 'student_index'>;
export type MeetingId = MeetingDTO['id'];

export type StudentPresences = Set<MeetingId>;
export type StudentActivities = Record<MeetingId, number>;

export type MeetingDetailsDTO = {
  data: {
    presences: Array<MeetingDTO['id']>;
    activities: StudentActivities;
  };
  student: Student;
};

export type MeetingDetailsModel = {
  data: {
    presences: StudentPresences;
    activities: StudentActivities;
  };
  student: Student;
};
