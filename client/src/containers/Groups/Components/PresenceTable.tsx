import { Checkbox, Table } from 'antd';
import React from 'react';
import { css } from 'react-emotion';

import { MeetingDTO, UserDTO } from '../../../../../common/api';

const fakeMeetings: MeetingDTO[] = Array.from({ length: 13 }).map((_, i) => ({
  date: '',
  id: i,
  meeting_name: `Spotkanie ${i}`,
}));

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
    return (
      <article
        className={css`
          width: 100%;
          overflow: auto;
        `}
      >
        <Table<StudentWithPresence>
          columns={columns}
          dataSource={data}
          pagination={false}
          style={{
            minWidth: '100%',
          }}
        />
      </article>
    );
  }
}
