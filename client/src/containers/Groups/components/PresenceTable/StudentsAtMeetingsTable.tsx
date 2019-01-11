import styled from '@emotion/styled';
import { MeetingDetailsModel, MeetingDTO } from 'common';
import React from 'react';

import { Table } from '../../../../components/Table';

import {
  BoxedMeetingData,
  BoxedStudent,
  FieldIdentifier,
  MeetingId,
  Unboxed,
} from './types';

type IdentifiedChangeHandler = (value: FieldIdentifier) => void;

type Props<TBoxedMeetingData extends BoxedMeetingData> = {
  meetings: MeetingDTO[];
  meetingsDetails: MeetingDetailsModel[];
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
    ...this.props.meetings.map(
      ({ meeting_name: meetingName, date, id: meetingId }) => ({
        dataIndex: 'data',
        key: meetingId,
        render: this.props.makeRenderMeetingData(
          meetingId,
          this.props.handleChange
        ),
        title: (
          <CenteredText>
            {meetingName}
            <Em>{new Date(date).toLocaleDateString('pl')}</Em>
          </CenteredText>
        ),
      })
    ),
  ];

  render() {
    const { meetingsDetails } = this.props;

    return (
      <Table
        rowKey={record => record.student.id}
        columns={this.columns}
        dataSource={meetingsDetails}
        pagination={false}
      />
    );
  }
}
