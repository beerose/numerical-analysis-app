import { MeetingDTO, UserDTO } from '../../../../../../common/api';

export type Student = Pick<UserDTO, 'id' | 'user_name' | 'student_index'>;
export type MeetingId = MeetingDTO['id'];

export type BoxedStudent = { student_data: Student };

export type StudentPresences = Set<MeetingId>;
export type StudentActivities = Record<MeetingId, number>;
export type BoxedPresences = { meetingData: StudentPresences };
export type BoxedActivities = { meetingData: StudentActivities };

export type PresencesAndActivities = {
  presences: StudentPresences;
  activities: StudentActivities;
};

export type BoxedPresencesAndActivities = {
  meetingData: PresencesAndActivities;
};

export type BoxedMeetingData = BoxedPresences | BoxedActivities | BoxedPresencesAndActivities;

export type Unboxed<T> = T[keyof T];

export type FieldIdentifier = { meetingId: MeetingId; studentId: Student['id'] };
