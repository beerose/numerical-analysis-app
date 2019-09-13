import { Dict } from 'nom-ts';

import { GroupId } from './Group';
import { MeetingId } from './Meeting';
import { TaskDTO, TaskId, TaskKind } from './Task';
import { UserDTO } from './User';

export type Student = Pick<UserDTO, 'id' | 'user_name' | 'student_index'>;

export type StudentTasksSummary = Array<{
  id: TaskId;
  name: string;
  kind: TaskKind;
  pts: number;
  max_pts: number;
  start_upload_date: Date;
  end_upload_date: Date;
  created_at: Date;
  updated_at: Date;
  data: Exclude<TaskDTO['data'], undefined>;
  group_id: GroupId;
}>;

export type StudentPresences = Set<MeetingId>;
export interface StudentActivities extends Dict<MeetingId, number> {}

export type UserWithGroups = UserDTO & {
  group_ids: GroupId[];
  groups_grades?: Array<{ group_id: GroupId; grade: number }>;
};
