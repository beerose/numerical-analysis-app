import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { GroupApiContextState } from '../GroupApiContext';
import { Flex, Table, Theme } from '../../../components';
import { Input } from 'antd';
import { UserDTO } from '../../../../../../dist/common';

type Props = GroupApiContextState & Pick<RouteComponentProps, 'history'>;
export const GradesSection = (_props: Props) => {
  const [editingItem, setEditingItem] = useState<UserDTO['id'] | null>(null);

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
      title: `Wystawiona ocena`,
      key: 'set_grade',
      render: (item: any) => (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            height: '30px',
          }}
        >
          {editingItem === item.id ? (
            <Input
              style={{
                width: '60px',
                height: '30px',
              }}
              type="number"
              defaultValue={item.set_grade}
            />
          ) : (
            item.suggested_grade
          )}
        </span>
      ),
    },
    {
      key: 'x',
      width: '130px',
      render: (item: any) => (
        <a
          role="button"
          onClick={() =>
            setEditingItem(editingItem === item.id ? null : item.id)
          }
        >
          {editingItem === item.id ? 'Zapisz ocenę' : 'Edytuj ocenę'}
        </a>
      ),
    },
  ];

  const data = [
    {
      //id
      student_name: 'Jan Kowalski',
      student_index: '123456',
      tasks_grade: 120,
      max_tasks_grade: 150,
      meetings_grade: 0,
      max_meetings_grade: 0,
      suggested_grade: 4.0,
      // set_grade?:
    },
  ];

  return (
    <Flex padding={Theme.Padding.Half}>
      <Table columns={columns} dataSource={data} pagination={false} bordered />
    </Flex>
  );
};
