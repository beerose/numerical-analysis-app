/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Spin, Upload } from 'antd';
import * as React from 'react';
import { Omit } from 'react-router';

import { UserDTO } from '../../../../../common/api';
import { ROLES } from '../../../../../common/roles';
import { groupsService, usersService } from '../../../api';
import { UsersTable } from '../../../components';
import { Theme } from '../../../components/theme';
import { LABELS } from '../../../utils/labels';
import { WrappedNewStudentModalForm } from '../components/AddStudentForm';

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;

const addUserButtonStyles = css`
  margin: ${Theme.Padding.Half};
  margin-left: ${Theme.Padding.Standard};
`;

type UploadObject = {
  file: File;
};

type Props = {
  groupId: string;
};
type State = {
  students: UserDTO[];
  isFetching: boolean;
  addStudentModalVisible: boolean;
  allStudents: UserDTO[];
};
export class StudentsSection extends React.Component<Props, State> {
  state = {
    addStudentModalVisible: false,
    allStudents: [],
    isFetching: false,
    students: [],
  };

  updateStudentsLists() {
    this.setState({ isFetching: true });
    groupsService.listStudentsForGroup(this.props.groupId).then(res => {
      this.setState({ students: res.students, isFetching: false });
    });
    usersService.listUsers({ roles: ROLES.student }).then(res => {
      this.setState({ allStudents: res.users });
    });
  }

  componentWillMount() {
    this.updateStudentsLists();
  }

  deleteStudent = (userId: string) => {
    groupsService.deleteUserFromGroup(userId).then(() => {
      this.updateStudentsLists();
    });
  };

  updateStudent = (user: Omit<UserDTO, 'user_role'>) => {
    usersService.updateUser({ ...user, user_role: ROLES.student }).then(() => {
      this.updateStudentsLists();
    });
  };

  onUpload = (uploadObject: UploadObject) => {
    const { groupId } = this.props;
    const { file } = uploadObject;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      groupsService.uploadUsers(reader.result as string, groupId).then(() => {
        this.updateStudentsLists();
      });
    };
  };

  addNewStudent = (user: UserDTO) => {
    groupsService.addStudentToGroup(user, this.props.groupId).then(() => {
      this.setState({ addStudentModalVisible: false });
      this.updateStudentsLists();
    });
  };

  cancelAddNewStudent = () => {
    this.setState({ addStudentModalVisible: false });
  };

  showAddStudentModal = () => {
    this.setState({ addStudentModalVisible: true });
  };

  render() {
    const { students, isFetching, addStudentModalVisible, allStudents } = this.state;
    return (
      <Container>
        <WrappedNewStudentModalForm
          allStudents={allStudents}
          onSubmit={this.addNewStudent}
          visible={addStudentModalVisible}
          onCancel={this.cancelAddNewStudent}
        />
        <section>
          <Button
            icon="user-add"
            type="primary"
            onClick={this.showAddStudentModal}
            css={addUserButtonStyles}
          >
            {LABELS.addNewUser}
          </Button>
          <Upload accept="text/csv" showUploadList={false} customRequest={this.onUpload}>
            <Button type="default" icon="upload">
              CSV Upload
            </Button>
          </Upload>
        </section>
        <Spin spinning={isFetching}>
          <UsersTable
            showPagination={false}
            onDelete={this.deleteStudent}
            onUpdate={this.updateStudent}
            users={students}
            extraColumns={['index']}
            css={{
              paddingLeft: Theme.Padding.Standard,
              width: '600px',
            }}
          />
        </Spin>
      </Container>
    );
  }
}
