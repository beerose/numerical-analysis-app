import * as t from 'io-ts';
import { isNumber } from 'util';

import { Grade, GroupDTO, UserPrivileges, UserRole } from './domain';
import { Typeguard } from './utils';

export type ApiResponse =
  | {
      message: string;
    }
  | {
      error: string;
      error_details?: string;
    };

export const userRoleOptions: string[] = Object.values(UserRole).filter(
  o => typeof o === 'string'
);

export type UserDTO = {
  id: number;
  user_name: string;
  email: string;
  student_index?: string;
  user_role: UserRole;
  active_user?: boolean;
  privileges?: UserPrivileges;
};

export const isUserId: Typeguard<UserDTO['id']> = isNumber;
export const userIdRuntimeType = new t.Type(
  'UserDTO.id',
  isUserId,
  t.number.validate,
  t.identity
);

export type UserWithGroups = UserDTO & {
  group_ids: Array<GroupDTO['id']>;
  groups_grades?: Array<{ group_id: GroupDTO['id']; grade: number }>;
};

export type Pagination = {
  offset: number;
  limit: number;
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

export enum TaskKind {
  Homework = 'homework', // zadanie domowe
  Assignment = 'assignment', // pracownia
  Exam = 'exam', // egzamin
  Test = 'test', // sprawdzian
  MidtermTest = 'midtermTest', // sprawdzian połówkowy
  ShortTest = 'shortTest', // kartkówka
  Retake = 'retake', // egzamin poprawkowy
  MidtermExam = 'midtermExam', // egzamin połówkowy
  Colloquium = 'colloquium', // kolokwium
}

export type ChoosableSubtask = {
  id: number;
  group_capacity: number;
  max_groups: number;
};

export type TaskDTO = {
  id: number;
  name: string;
  kind: TaskKind;
  weight: number;
  max_points: number;
  results_date?: string | Date; // if empty then due date
  description?: string;
  verify_upload: boolean; // default true
  start_upload_date: string | Date;
  end_upload_date: string | Date; // due date of the task
  data?: {
    choosable_subtasks: ChoosableSubtask[];
  };
};

export type UserTaskPoints = {
  user_id: UserDTO['id'];
  task_id: TaskDTO['id'];
  points: number;
};

export type UserResultsDTO = {
  user_id: UserDTO['id'];
  tasks_grade: number;
  max_tasks_grade: number;
  presences: number; // presences and activity
  sum_activity: number;
};

export type UserResultsModel = {
  userId: UserDTO['id'];
  userName: UserDTO['user_name'];
  index: UserDTO['student_index'];
  finalGrade?: Grade;
  tasksPoints: number;
  maxTasksPoints: number;
  presences: number;
  activity: number;
};

export type StudentTasksSummary = Array<{
  id: TaskDTO['id'];
  name: string;
  kind: TaskKind;
  pts: number;
  max_pts: number;
  start_upload_date: Date;
  end_upload_date: Date;
  created_at: Date;
  updated_at: Date;
  data: Exclude<TaskDTO['data'], undefined>;
}>;
