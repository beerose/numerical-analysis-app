export type ApiResponse =
  | {
      message: string;
    }
  | {
      error: string;
      errorDetails?: string;
    };

// TODO: as const

export const ServerRoutes = {
  Accounts: {
    Login: '/accounts.login',
    New: '/accounts.new',
  },
  Groups: {
    Create: '/groups.create',
    Delete: '/groups.delete',
    Get: '/groups.get',
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
  id: number;
  user_name: string;
  email: string;
  student_index?: string;
  user_role: UserRole;
  active_user?: boolean;
};

export type Where = 'groups' | 'users';
export type What = 'edit' | 'read';
export type UserPrivileges = { [key in Where]: Record<GroupDTO['id'], What[]> };

export type Pagination = {
  offset: number;
  limit: number;
};

export enum GroupType {
  Lab = 'lab',
  Exercise = 'exercise',
  Lecture = 'lecture',
}

export type GroupDTO = {
  id: number;
  group_name: string;
  group_type: GroupType;
  lecturer_id: UserDTO['id'];
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
    presences: MeetingDTO['id'][];
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
