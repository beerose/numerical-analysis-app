import { MeetingDTO, UserDTO } from '../../../../../../common/api';

export type Student = Pick<UserDTO, 'id' | 'user_name' | 'student_index'>;
export type MeetingId = MeetingDTO['id'];

export type BoxedStudent = { student: Student };

export type StudentPresences = Set<MeetingId>;
export type StudentActivities = Record<MeetingId, number>;
export type BoxedPresences = { data: StudentPresences };
export type BoxedActivities = { data: StudentActivities };

export type PresencesAndActivities = {
  presences: StudentPresences;
  activities: StudentActivities;
};

export type BoxedPresencesAndActivities = {
  data: PresencesAndActivities;
};

export type BoxedMeetingData = BoxedPresences | BoxedActivities | BoxedPresencesAndActivities;

export type Unboxed<T> = T[keyof T];

export type FieldIdentifier = { meetingId: MeetingId; studentId: Student['id'] };
