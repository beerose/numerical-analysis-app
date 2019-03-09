import * as t from 'io-ts';
import { isNumber, isString } from 'util';

import { isGroupKind, Typeguard } from './utils';

export type ApiResponse =
  | {
      message: string;
    }
  | {
      error: string;
      error_details?: string;
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
export type UserPrivileges = {
  [key in Where]?: Record<GroupDTO['id'], What[]>
};

const isUserId: Typeguard<GroupDTO['id']> = isNumber;
export const userIdRuntimeType = new t.Type(
  'UserDTO.id',
  isUserId,
  t.number.validate,
  t.identity
);

export type UserWithGroups = UserDTO & { group_ids: GroupDTO['id'][] };

export type Pagination = {
  offset: number;
  limit: number;
};

export enum GroupType {
  Lab = 'lab',
  Exercise = 'exercise',
  Lecture = 'lecture',
}

const isGroupType: Typeguard<GroupDTO['group_type']> = isGroupKind;
export const groupTypeRuntimeType = new t.Type(
  'GroupDTO.group_type',
  isGroupType,
  (u, c) => (isGroupType ? t.success(u as GroupType) : t.failure(u, c)),
  t.identity
);

export type GroupDTO = {
  id: number;
  group_name: string;
  group_type: GroupType;
  lecturer_id: UserDTO['id'];
  lecturer_name?: string;
  class_number?: number;
  semester?: string;
  data?: {
    tresholds?: Tresholds;
    grade_equation?: string;
  };
};

const isGroupId: Typeguard<GroupDTO['id']> = isNumber;
export const groupIdRuntimeType = new t.Type(
  'GroupDTO.id',
  isGroupId,
  t.number.validate,
  t.identity
);

const isGroupName: Typeguard<GroupDTO['group_name']> = isString;
export const groupNameRuntimeType = new t.Type(
  'GroupDTO.group_name',
  isGroupName,
  t.string.validate,
  t.identity
);

export type Tresholds = {
  '3': number;
  '3.5': number;
  '4': number;
  '4.5': number;
  '5': number;
};

export type GroupWithLecturer = GroupDTO & {
  lecturer_name: UserDTO['user_name'];
};

export type MeetingDTO = {
  id: number;
  meeting_name: string;
  date: string;
  group_id: number;
};

export type MeetingModel = {
  name: string;
  date: Date;
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

export enum TaskKind {
  Homework = 'homework', // zadanie domowe
  Assignment = 'assignment', // pracownia
}

export enum TestKind {
  Exam = 'exam', // egzamin
  Test = 'test', // sprawdzian
  MidtermTest = 'midtermTest', // sprawdzian połówkowy
  ShortTest = 'shortTest', // kartkówka
  Retake = 'retake', // egzamin poprawkowy
  MidtermExam = 'midtermExam', // egzamin połówkowy
  Colloquium = 'colloquium', // kolokwium
}

export type TaskDTO = {
  id: number;
  name: string;
  kind: TaskKind | TestKind;
  weight: number;
  max_points: number;
  results_date?: string | Date; // if empty then due date
  description?: string;
  verify_upload: boolean; // default true
  start_upload_date: string | Date;
  end_upload_date: string | Date; // due date of the task
};
