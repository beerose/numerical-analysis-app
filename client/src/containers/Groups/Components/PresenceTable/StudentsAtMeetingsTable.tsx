import { Table } from 'antd';
import React from 'react';
import styled, { css } from 'react-emotion';

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
    record: BoxedStudent & TBoxedMeetingData,
    index: number
  ) => React.ReactNode;
  handleChange: IdentifiedChangeHandler;
};

const TABLE_SCROLL_CONFIG = {
  x: true,
};

const CenteredText = styled.div`
  text-align: center;
`;

const Em = styled.em`
  display: block;
`;

export class StudentsAtMeetingsTable<
  TBoxedMeetingData extends BoxedMeetingData
> extends React.Component<Props<TBoxedMeetingData>> {
  columns = [
    {
      dataIndex: 'student.user_name',
      fixed: true,
      key: 'user_name',
      sorter: (a: BoxedStudent, b: BoxedStudent) =>
        Number(a.student.user_name < b.student.user_name),
      title: 'Student',
    },
    {
      dataIndex: 'student.student_index',
      fixed: true,
      key: 'student_index',
      sorter: (a: BoxedStudent, b: BoxedStudent) =>
        Number(a.student.student_index) - Number(b.student.student_index),
      title: 'Indeks',
    },
    ...this.props.meetings.map(({ meeting_name: meetingName, date, id: meetingId }) => ({
      dataIndex: 'meetingData',
      key: meetingId,
      render: this.props.makeRenderMeetingData(meetingId, this.props.handleChange),
      title: (
        <CenteredText>
          {meetingName}
          <Em>{date}</Em>
        </CenteredText>
      ),
    })),
  ];

  render() {
    const { loadedStudents } = this.props;

    return (
      <article
        className={css`
          width: 100%;
          overflow: hidden;
        `}
      >
        <Table<BoxedStudent & TBoxedMeetingData & BoxedKey>
          scroll={TABLE_SCROLL_CONFIG}
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
