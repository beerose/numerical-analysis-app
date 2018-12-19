import { MeetingDTO } from '../../../../../../common/api';

export const fakeMeetings: MeetingDTO[] = Array.from({ length: 13 }).map((_, i) => ({
  date: '',
  id: i,
  meeting_name: `Spotkanie ${i}`,
}));

export const fakeLoadedStudents: Array<BoxedStudent & BoxedPresences & BoxedKey> = [
  {
    key: 'Borys121',
    meetingData: new Set([4]),
    student: {
      id: 'Borys121',
      student_index: '277501',
      user_name: 'Borys',
    },
  },
  {
    key: 'Hutch214',
    meetingData: new Set([1, 2]),
    student: {
      id: 'Hutch214',
      student_index: '277502',
      user_name: 'Hutch',
    },
  },
  {
    key: 'Alex121',
    meetingData: new Set([2, 3]),
    student: {
      id: 'Alex121',
      student_index: '277503',
      user_name: 'Alex',
    },
  },
  {
    key: 'Anton',
    meetingData: new Set([4]),
    student: {
      id: 'Anton',
      student_index: '277504',
      user_name: 'Borys',
    },
  },
  {
    key: 'Mikołaj',
    meetingData: new Set([5, 2, 3, 1, 8]),
    student: {
      id: 'Mikołaj',
      student_index: '271506',
      user_name: 'Mikołaj',
    },
  },
  {
    key: 'Wojtek',
    meetingData: new Set([6, 1, 2, 3, 4]),
    student: {
      id: 'Wojtek',
      student_index: '277523',
      user_name: 'Wojtek',
    },
  },
];
