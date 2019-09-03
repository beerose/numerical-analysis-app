import * as t from 'io-ts';
import { Dict, Flavor } from 'nom-ts';
import { isNumber } from 'util';

import { Typeguard } from '../utils';

import { Grade } from './Grade';
import { GroupId } from './Group';
import { TaskId } from './Task';

export type UserId = Flavor<number, 'UserId'>;

export const isUserId: Typeguard<UserId> = isNumber;

export const userIdRuntimeType = new t.Type(
  'UserId',
  isUserId,
  t.number.validate,
  t.identity
);

export type UserDTO = {
  id: UserId;
  user_name: string;
  email: string;
  student_index?: string;
  user_role: UserRole;
  active_user?: boolean;
  privileges?: UserPrivileges;
};

export enum UserRole {
  Admin = 'admin',
  SuperUser = 'superUser',
  Student = 'student',
}

export namespace UserRole {
  export const All = [UserRole.Admin, UserRole.SuperUser, UserRole.Student];
  export const NonStudents = [UserRole.Admin, UserRole.SuperUser];

  const values: UserRole[] = Object.values(UserRole);

  export function assert(str: string): UserRole {
    if (values.includes(str as UserRole)) {
      return str as UserRole;
    }
    throw new Error(
      `${str} is not UserRole. Legal roles are ${values.join(' ')}`
    );
  }
}

export namespace UserPrivileges {
  export type Where = 'groups' | 'users';
  export type What = 'edit' | 'read';
}

export type UserPrivileges = {
  [key in UserPrivileges.Where]?: Dict<GroupId, UserPrivileges.What[]>;
};

export type UserTaskPoints = {
  user_id: UserId;
  task_id: TaskId;
  points: number;
};

export type UserResultsDTO = {
  user_id: UserId;
  tasks_grade: number;
  max_tasks_grade: number;
  presences: number; // presences and activity
  sum_activity: number;
};

export type UserResultsModel = {
  userId: UserId;
  userName: UserDTO['user_name'];
  index: UserDTO['student_index'];
  finalGrade?: Grade;
  tasksPoints: number;
  maxTasksPoints: number;
  presences: number;
  activity: number;
};

export const userRoleOptions: string[] = Object.values(UserRole).filter(
  o => typeof o === 'string'
);
