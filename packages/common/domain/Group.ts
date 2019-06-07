import * as t from 'io-ts';
import { isNumber, isString } from 'util';

import { UserDTO } from '../api';
import { Typeguard } from '../utils';

import { Tresholds } from './Tresholds';

export enum GroupType {
  Lab = 'lab',
  Exercise = 'exercise',
  Lecture = 'lecture',
}

export type GroupGradeSettings = {
  tresholds?: Tresholds;
  grade_equation?: string;
};

export const isGroupType = (x: unknown): x is GroupType =>
  Object.values(GroupType).includes(x);

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
  semester?: string;
  data?: GroupGradeSettings;
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

export type GroupWithLecturer = GroupDTO & {
  lecturer_name: UserDTO['user_name'];
};
