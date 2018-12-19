import { MeetingDTO, UserDTO } from '../../../../../../common/api';

export type Student = Pick<UserDTO, 'id' | 'user_name' | 'student_index'>;
export type MeetingId = MeetingDTO['id'];

export type BoxedStudent = { student: Student };
export type BoxedPresences = { meetingData: Set<MeetingDTO['id']> };
export type BoxedActivities = { meetingData: Record<MeetingDTO['id'], number> };

export type BoxedPresencesAndActivities = BoxedPresences & BoxedActivities;

export type BoxedKey = { key: string };

export type BoxedMeetingData = BoxedPresences | BoxedActivities | BoxedPresencesAndActivities;

export type Unboxed<T> = T[keyof T];

export type FieldIdentifier = { identifier: { meetingId: MeetingId; studentId: Student['id'] } };
export type IdentifiedChangeHandler = (event: { target: FieldIdentifier }) => void;
