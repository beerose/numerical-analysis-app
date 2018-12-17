import { Checkbox as AntCheckbox, Table } from 'antd';
import {
  AbstractCheckboxProps,
  CheckboxChangeEvent,
  CheckboxChangeEventTarget,
} from 'antd/lib/checkbox/Checkbox';
import React from 'react';
import { css } from 'react-emotion';

import { MeetingDTO, UserDTO } from '../../../../../common/api';

type Student = Pick<UserDTO, 'id' | 'user_name'>;
type MeetingId = MeetingDTO['id'];

type BoxedStudent = { student: Student };
type BoxedPresences = { meetingData: Set<MeetingDTO['id']> };
type BoxedActivities = { meetingData: Record<MeetingDTO['id'], number> };

type BoxedKey = { key: string };

const fakeMeetings: MeetingDTO[] = Array.from({ length: 13 }).map((_, i) => ({
  date: '',
  id: i,
  meeting_name: `Spotkanie ${i}`,
}));

const fakeLoadedStudents: Array<BoxedStudent & BoxedPresences & BoxedKey> = [
  {
    key: 'Borys121',
    meetingData: new Set([4]),
    student: {
      id: 'Borys121',
      user_name: 'Borys',
    },
  },
  {
    key: 'Hutch214',
    meetingData: new Set([1, 2]),
    student: {
      id: 'Hutch214',
      user_name: 'Hutch',
    },
  },
  {
    key: 'Alex121',
    meetingData: new Set([2, 3]),
    student: {
      id: 'Alex121',
      user_name: 'Alex',
    },
  },
  {
    key: 'Anton',
    meetingData: new Set([4]),
    student: {
      id: 'Anton',
      user_name: 'Borys',
    },
  },
  {
    key: 'Mikołaj',
    meetingData: new Set([5, 2, 3, 1, 8]),
    student: {
      id: 'Mikołaj',
      user_name: 'Mikołaj',
    },
  },
  {
    key: 'Wojtek',
    meetingData: new Set([6, 1, 2, 3, 4]),
    student: {
      id: 'Wojtek',
      user_name: 'Wojtek',
    },
  },
];

type BoxedMeetingData = BoxedPresences | BoxedActivities;

type Unboxed<T> = T[keyof T];

type ChangeHandler = (event: { target: FieldIdentifier }) => void;

type Props<TBoxedMeetingData extends BoxedMeetingData> = {
  meetings: MeetingDTO[];
  loadedStudents: Array<BoxedStudent & TBoxedMeetingData & BoxedKey>;
  makeRenderMeetingData: (
    meetingId: MeetingId,
    handleChange: ChangeHandler
  ) => (
    meetingData: Unboxed<TBoxedMeetingData>,
    record: BoxedStudent & TBoxedMeetingData
  ) => React.ReactNode;
  handleChange: ChangeHandler;
};

type FieldIdentifier = { identifier: { meetingId: MeetingId; studentId: Student['id'] } };

type MarkedCheckboxChangeEventTarget = CheckboxChangeEventTarget & FieldIdentifier;

interface MarkedCheckboxChangeEvent extends CheckboxChangeEvent {
  target: MarkedCheckboxChangeEventTarget;
  indeterminate?: boolean;
}

const Checkbox = (AntCheckbox as any) as React.ComponentType<
  FieldIdentifier & AbstractCheckboxProps<MarkedCheckboxChangeEvent>
>;

const makeRenderPresenceCheckbox = (
  meetingId: MeetingId,
  handleChange: (event: { target: MarkedCheckboxChangeEventTarget }) => void
) => (presences: Set<MeetingId>, record: BoxedStudent & BoxedPresences) => (
  <Checkbox
    identifier={{
      meetingId,
      studentId: record.student.id,
    }}
    checked={presences.has(meetingId)}
    onChange={handleChange}
  />
);

export class StudentsAtMeetingsTable<
  TBoxedMeetingData extends BoxedMeetingData
> extends React.Component<Props<TBoxedMeetingData>> {
  columns = [
    {
      dataIndex: 'student.user_name',
      key: 'student',
      title: 'Student',
    },
    ...this.props.meetings.map(({ meeting_name: meetingName, id: meetingId }) => ({
      dataIndex: 'meetingData',
      key: meetingId,
      render: this.props.makeRenderMeetingData(meetingId, this.props.handleChange),
      title: meetingName,
    })),
  ];

  render() {
    const { loadedStudents } = this.props;

    return (
      <article
        className={css`
          width: 100%;
          overflow: auto;
        `}
      >
        <Table<BoxedStudent & TBoxedMeetingData & BoxedKey>
          columns={this.columns}
          dataSource={loadedStudents}
          pagination={false}
          style={{
            minWidth: '100%',
          }}
        />
      </article>
    );
  }
}

export const PresenceTable = () => {
  return (
    <StudentsAtMeetingsTable
      meetings={fakeMeetings}
      loadedStudents={fakeLoadedStudents}
      makeRenderMeetingData={makeRenderPresenceCheckbox}
      handleChange={console.log}
    />
  );
};
