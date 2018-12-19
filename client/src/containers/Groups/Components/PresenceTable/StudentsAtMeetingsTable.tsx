import { Table } from 'antd';
import { css } from 'emotion';
import React from 'react';

import { MeetingDTO } from '../../../../../../common/api';

import {
  BoxedKey,
  BoxedMeetingData,
  BoxedStudent,
  FieldIdentifier,
  MeetingId,
  Unboxed,
} from './types';

type IdentifiedChangeHandler = (value: FieldIdentifier) => void;

type Props<TBoxedMeetingData extends BoxedMeetingData> = {
  meetings: MeetingDTO[];
  loadedStudents: Array<BoxedStudent & TBoxedMeetingData & BoxedKey>;
  makeRenderMeetingData: (
    meetingId: MeetingId,
    handleChange: IdentifiedChangeHandler
  ) => (
    meetingData: Unboxed<TBoxedMeetingData>,
    record: BoxedStudent & TBoxedMeetingData
  ) => React.ReactNode;
  handleChange: IdentifiedChangeHandler;
};

export class StudentsAtMeetingsTable<
  TBoxedMeetingData extends BoxedMeetingData
> extends React.Component<Props<TBoxedMeetingData>> {
  columns = [
    {
      dataIndex: 'student.user_name',
      key: 'user_name',
      sorter: (a: BoxedStudent, b: BoxedStudent) =>
        Number(a.student.user_name < b.student.user_name),
      title: 'Student',
    },
    {
      dataIndex: 'student.student_index',
      key: 'student_index',
      sorter: (a: BoxedStudent, b: BoxedStudent) =>
        Number(a.student.student_index) - Number(b.student.student_index),
      title: 'Indeks',
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
