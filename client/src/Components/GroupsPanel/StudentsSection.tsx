import { Icon, Menu, Spin } from 'antd';
import { css } from 'emotion';
import * as React from 'react';
import styled from 'react-emotion';

import { UsersTable } from '../EditableUserTable';

const Container = styled.section`
  display: flex;
  flex-direction: row;
`;

type Props = {
  groupId: string;
};
export class StudentsSection extends React.Component<Props> {
  render() {
    return (
      <Container>
        <Spin spinning={false}>
          <UsersTable
            pageSize={5}
            showPagination={false}
            onDelete={() => console.log('action')}
            onUpdate={() => console.log('action')}
            users={[
              {
                email: 'aaa',
                id: '1',
                student_index: '123456',
                user_name: 'ola',
                user_role: 'student',
              },
            ]}
            total={1}
            extraColumns={['index']}
            style={{
              padding: '50px',
              width: '600px',
            }}
          />
        </Spin>
      </Container>
    );
  }
}
