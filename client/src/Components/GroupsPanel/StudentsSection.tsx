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
  isFetching: boolean;
};
export class StudentsSection extends React.Component<Props, State> {
  state = {
    isFetching: false,
    students: [],
  };

  componentWillMount() {
    groupsService.listStudentsForGroup(this.props.groupId).then(res => {
      this.setState({ students: res.students });
    });
  }

  deleteStudent = (userId: string) => {
    groupsService.deleteUserFromGroup(userId);
    this.updateStudentsList();
  };

  updateStudent = (user: UserDTO) => {
    groupsService.updateUserFromGroup(user);
    this.updateStudentsList();
  };

  updateStudentsList() {
    this.setState({ isFetching: true });
    groupsService.listStudentsForGroup(this.props.groupId).then(res => {
      this.setState({ students: res.students, isFetching: false });
    });
  }

  render() {
    return (
      <Container>
        <Spin spinning={this.state.isFetching}>
          <UsersTable
            pageSize={5}
            showPagination={false}
            onDelete={this.deleteStudent}
            onUpdate={this.updateStudent}
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
