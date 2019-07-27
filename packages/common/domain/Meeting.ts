import { Flavor } from 'nom-ts';

import { Student, StudentActivities, StudentPresences } from './Student';

export type MeetingId = Flavor<number, 'MeetingId'>;

export type MeetingDTO = {
  id: MeetingId;
  meeting_name: string;
  date: string;
  group_id: number;
};

export type MeetingModel = {
  name: string;
  date: Date;
};

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
