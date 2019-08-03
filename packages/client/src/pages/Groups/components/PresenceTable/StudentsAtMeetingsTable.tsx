import styled from '@emotion/styled';
import { SortOrder } from 'antd/lib/table';
import { MeetingDetailsModel, MeetingDTO } from 'common';
import React from 'react';

import { Table } from '../../../../components/Table';
import { makeTableSorter } from '../../../../utils/makeTableSorter';

import { FieldIdentifier, MeetingId } from './types';
import { AllStudentsPresenceCheckbox } from './AllStudentsPresenceCheckbox';

const sortDirections = ['descend', 'ascend'] as SortOrder[];

type IdentifiedChangeHandler<T extends FieldIdentifier> = (
  eventTarget: T
) => void;

type Props<T extends FieldIdentifier> = {
  meetings: MeetingDTO[];
  meetingsDetails: MeetingDetailsModel[];
  makeRenderMeetingData: (
    meetingId: MeetingId,
    handleChange: IdentifiedChangeHandler<T>,
    editable: boolean
  ) => (
    meetingData: MeetingDetailsModel['data'],
    record: MeetingDetailsModel,
    index: number
  ) => React.ReactNode;
  handleChange: IdentifiedChangeHandler<T>;
  editable: boolean;
};

const CenteredText = styled.div`
  text-align: center;
`;

const Em = styled.em`
  display: block;
  border-bottom: 1px solid currentColor;
`;

export class StudentsAtMeetingsTable<
  T extends FieldIdentifier
> extends React.Component<Props<T>> {
  columns = [
    {
      dataIndex: 'student.user_name',
      fixed: true,
      key: 'user_name',
      sorter: makeTableSorter<MeetingDetailsModel>(x => x.student.user_name),
      title: 'Student',
    },
    {
      dataIndex: 'student.student_index',
      fixed: true,
      key: 'student_index',
      sorter: makeTableSorter<MeetingDetailsModel>(
        x => x.student.student_index
      ),
      title: 'Indeks',
    },
    ...this.props.meetings.map(
      ({ meeting_name: meetingName, date, id: meetingId }) => ({
        dataIndex: 'data',
        key: meetingId,
        render: this.props.makeRenderMeetingData(
          meetingId,
          this.props.handleChange,
          this.props.editable
        ),
        title: (
          <CenteredText>
            {meetingName}
            <Em>{new Date(date).toLocaleDateString('pl')}</Em>
            <AllStudentsPresenceCheckbox
              meetingId={meetingId}
              editable={this.props.editable}
            />
          </CenteredText>
        ),
      })
    ),
  ];

  render() {
    const { meetingsDetails } = this.props;

    return (
      <Table
        size="small"
        sortDirections={sortDirections}
        rowKey={record => String(record.student.id)}
        columns={this.columns}
        dataSource={meetingsDetails}
        pagination={false}
      />
    );
  }
}
