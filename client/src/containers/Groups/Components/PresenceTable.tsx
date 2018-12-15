import { Checkbox, Table } from 'antd';
import React from 'react';

import { MeetingDTO, UserDTO } from '../../../../../common/api';

const fakeMeetings: MeetingDTO[] = [
  {
    date: '',
    id: 1,
    meeting_name: 'Ćwiczenia 1',
  },
  {
    date: '',
    id: 2,
    meeting_name: 'Ćwieczenia 2',
  },
  {
    date: '',
    id: 3,
    meeting_name: 'Ćwiczenia 3',
  },
  {
    date: '',
    id: 4,
    meeting_name: 'Ćwiczenia 4',
  },
];

type StudentWithPresence = {
  student: Pick<UserDTO, 'id' | 'user_name'>;
  presences: Set<MeetingDTO['id']>;
};

const columns = [
  {
    dataIndex: 'student.user_name',
    key: 'student',
    title: 'Student',
  },
  ...fakeMeetings.map(({ meeting_name: meetingName, id: meetingId }) => ({
    dataIndex: 'presences',
    key: meetingId,
    render: (presences: Set<MeetingDTO['id']>, record: StudentWithPresence) => (
      <Checkbox
        data-identifier={{
          meetingId,
          studentId: record.student.id,
        }}
        checked={presences.has(meetingId)}
        onChange={event => {
          console.log(event);
        }}
      />
    ),
    title: meetingName,
  })),
];

const data: (StudentWithPresence & { key: string })[] = [
  {
    key: 'Borys121',
    presences: new Set([4]),
    student: {
      id: 'Borys121',
      user_name: 'Borys',
    },
  },
  {
    key: 'Hutch214',
    presences: new Set([1, 2]),
    student: {
      id: 'Hutch214',
      user_name: 'Hutch',
    },
  },
  {
    key: 'Alex121',
    presences: new Set([2, 3]),
    student: {
      id: 'Alex121',
      user_name: 'Alex',
    },
  },
];

export class PresenceTable extends React.Component {
  render() {
    return <Table<StudentWithPresence> columns={columns} dataSource={data} />;
  }
}
