import { MeetingDTO } from '../../../../../../common/api';

import { BoxedKey, BoxedPresencesAndActivities, BoxedStudent } from './types';

export const fakeMeetings: MeetingDTO[] = Array.from({ length: 13 })
  .map((_, i) => ({
    date: new Date(Date.now() + Math.floor(Math.random() * 3600 * 24 * 10000)).toLocaleDateString(
      'pl'
    ),
    id: i,
    meeting_name: `Spotkanie ${i}`,
  }))
  .reverse();

export const fakeLoadedStudents: Array<BoxedStudent & BoxedPresencesAndActivities & BoxedKey> = [
  {
    key: 'Borys121',
    meetingData: { activities: { 4: 2, 12: 3, 11: 1 }, presences: new Set([4, 12, 11]) },
    student: {
      id: 'Borys121',
      student_index: '277501',
      user_name: 'Borys',
    },
  },
  {
    key: 'Hutch214',
    meetingData: { activities: { 1: 1, 2: 3 }, presences: new Set([1, 2]) },
    student: {
      id: 'Hutch214',
      student_index: '277502',
      user_name: 'Hutch',
    },
  },
  {
    key: 'Alex121',
    meetingData: { activities: {}, presences: new Set([2, 3]) },
    student: {
      id: 'Alex121',
      student_index: '277503',
      user_name: 'Alex',
    },
  },
  {
    key: 'Anton',
    meetingData: { activities: {}, presences: new Set([4]) },
    student: {
      id: 'Anton',
      student_index: '277504',
      user_name: 'Borys',
    },
  },
  {
    key: 'Mikołaj',
    meetingData: { activities: {}, presences: new Set([5, 2, 3, 1, 8]) },
    student: {
      id: 'Mikołaj',
      student_index: '271506',
      user_name: 'Mikołaj',
    },
  },
  {
    key: 'Wojtek',
    meetingData: { activities: {}, presences: new Set([6, 1, 2, 3, 4]) },
    student: {
      id: 'Wojtek',
      student_index: '277523',
      user_name: 'Wojtek',
    },
  },
];