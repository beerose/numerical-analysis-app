import React from 'react';
import { RouteComponentProps } from 'react-router';

import { GroupApiContextState } from '../GroupApiContext';
import { Flex, Table, Theme } from '../../../components';

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const GradesSection = (props: Props) => {
  const columns = [
    { title: 'Imię i nazwisko', dataIndex: 'student_name', key: 'name' },
    { title: 'Index', dataIndex: 'student_index', key: 'index' },
    {
      title: `Testy i zadania`,
      key: 'tasks_grade',
      render: (item: any) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {item.tasks_grade} / <b>{item.max_tasks_grade}</b>
        </span>
      ),
    },
    {
      title: 'Obecnośći i aktywnośći',
      key: 'meetings_grade',
      render: (item: any) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {item.meetings_grade} / <b>{item.max_meetings_grade}</b>
        </span>
      ),
    },
    {
      title: `Proponowana ocena`,
      key: 'suggested_grade',
      render: (item: any) => (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          {item.suggested_grade}
        </span>
      ),
    },
    {
      key: 'x',
      render: () => <a href="javascript:;">Edytuj ocenę</a>,
    },
  ];

  const data = [
    {
      student_name: 'Jan Kowalski',
      student_index: '123456',
      tasks_grade: 120,
      max_tasks_grade: 150,
      meetings_grade: 0,
      max_meetings_grade: 0,
      suggested_grade: 4.0,
    },
  ];

  return (
    <Flex padding={Theme.Padding.Half}>
      <Table columns={columns} dataSource={data} pagination={false} bordered />
    </Flex>
  );
};
