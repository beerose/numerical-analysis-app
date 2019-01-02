/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Table } from 'antd';
import React from 'react';

import { MeetingDetailsModel, MeetingDTO } from '../../../../../../common/api';

import { BoxedMeetingData, BoxedStudent, FieldIdentifier, MeetingId, Unboxed } from './types';

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

const TABLE_SCROLL_CONFIG = {
  x: '100%',
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
      dataIndex: 'data',
      key: meetingId,
      render: this.props.makeRenderMeetingData(meetingId, this.props.handleChange),
      title: (
        <CenteredText>
          {meetingName}
          <Em>{new Date(date).toLocaleDateString('pl')}</Em>
        </CenteredText>
      ),
    })),
  ];

  render() {
    const { meetingsDetails } = this.props;

    return (
      <article
        css={css`
          th.ant-table-fixed-columns-in-body.ant-table-column-sort {
            background-color: rgb(250, 250, 250);
          }
          td.ant-table-fixed-columns-in-body.ant-table-column-sort {
            background-color: none;
          }
          .ant-table-fixed-columns-in-body {
            > div {
              width: 0px;
              visibility: hidden;
            }
            color: transparent;
            user-select: none;
          }
        `}
      >
        <Table
          rowKey={record => record.student.id}
          scroll={TABLE_SCROLL_CONFIG}
          columns={this.columns}
          dataSource={meetingsDetails}
          pagination={false}
        />
      </article>
    );
  }
}
