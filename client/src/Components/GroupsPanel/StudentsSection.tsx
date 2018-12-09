import { Icon, Menu, Spin } from 'antd';
import * as React from 'react';
import styled from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import { groupsService } from '../../api';
import { UsersTable } from '../EditableUserTable';

const Container = styled.section`
  display: flex;
  flex-direction: row;
`;

type Props = {
  groupId: string;
};
type State = {
  students: UserDTO[];
};
export class StudentsSection extends React.Component<Props, State> {
  state = {
    students: [],
  };

  componentWillMount() {
    groupsService.listStudentsForGroup(this.props.groupId).then(res => {
      this.setState({ students: res.students });
    });
  }

  render() {
    return (
      <Container>
        <Spin spinning={false}>
          <UsersTable
            pageSize={5}
            showPagination={false}
            onDelete={() => console.log('action')}
            onUpdate={() => console.log('action')}
            users={this.state.students}
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
