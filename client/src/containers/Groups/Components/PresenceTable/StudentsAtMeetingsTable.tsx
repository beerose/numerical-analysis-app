/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Table } from 'antd';
import React from 'react';

import { MeetingDTO } from '../../../../../../common/api';

import { BoxedMeetingData, BoxedStudent, FieldIdentifier, MeetingId, Unboxed } from './types';

type IdentifiedChangeHandler = (value: FieldIdentifier) => void;

type Props<TBoxedMeetingData extends BoxedMeetingData> = {
  meetings: MeetingDTO[];
  loadedStudents: Array<BoxedStudent & TBoxedMeetingData>;
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
  x: 400,
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
      dataIndex: 'studentData.user_name',
      fixed: true,
      key: 'user_name',
      sorter: (a: BoxedStudent, b: BoxedStudent) =>
        Number(a.studentData.user_name < b.studentData.user_name),
      title: 'Student',
    },
    {
      dataIndex: 'studentData.student_index',
      fixed: true,
      key: 'student_index',
      sorter: (a: BoxedStudent, b: BoxedStudent) =>
        Number(a.studentData.student_index) - Number(b.studentData.student_index),
      title: 'Indeks',
    },
    ...this.props.meetings.map(({ meeting_name: meetingName, date, id: meetingId }) => ({
      dataIndex: 'meetingData',
      key: meetingId,
      render: this.props.makeRenderMeetingData(meetingId, this.props.handleChange),
      title: (
        <CenteredText>
          {meetingName}
          <Em>{'date'}</Em>
        </CenteredText>
      ),
    })),
  ];

  render() {
    console.log(this.props.meetings);
    const { loadedStudents } = this.props;

    return (
      <article
        css={css`
          max-width: 100%;
          overflow: hidden;
        `}
      >
        <Table<BoxedStudent & TBoxedMeetingData>
          scroll={TABLE_SCROLL_CONFIG}
          columns={this.columns}
          dataSource={loadedStudents}
          pagination={false}
        />
      </article>
    );
  }
}
