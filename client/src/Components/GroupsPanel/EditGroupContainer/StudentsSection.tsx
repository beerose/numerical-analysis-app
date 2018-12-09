import { Button, Spin, Upload } from 'antd';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { UserDTO } from '../../../../../common/api';
import { groupsService } from '../../../api';
import { LABELS } from '../../../utils/labels';
import { UsersTable } from '../../EditableUserTable';

import { WrappedNewStudentModalForm } from './AddStudentForm';

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;

const buttonStyles = css`
  margin: 20px 20px 20px 50px;
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
};
export class StudentsSection extends React.Component<Props, State> {
  state = {
    addStudentModalVisible: false,
    isFetching: false,
    students: [],
  };

  componentWillMount() {
    groupsService.listStudentsForGroup(this.props.groupId).then(res => {
      this.setState({ students: res.students });
    });
  }

  deleteStudent = (userId: string) => {
    groupsService.deleteUserFromGroup(userId).then(() => {
      this.updateStudentsList();
    });
  };

  updateStudent = (user: UserDTO) => {
    groupsService.updateUserFromGroup(user).then(() => {
      this.updateStudentsList();
    });
  };

  onUpload = (uploadObject: UploadObject) => {
    const { groupId } = this.props;
    const { file } = uploadObject;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      groupsService.uploadUsers(reader.result as string, groupId).then(() => {
        this.updateStudentsList();
      });
    };
  };

  updateStudentsList() {
    this.setState({ isFetching: true });
    groupsService.listStudentsForGroup(this.props.groupId).then(res => {
      this.setState({ students: res.students, isFetching: false });
    });
  }

  addNewStudent = (user: UserDTO) => {
    groupsService.addStudentToGroup(user, this.props.groupId).then(() => {
      this.setState({ addStudentModalVisible: false });
      this.updateStudentsList();
    });
  };

  cancelAddNewStudent = () => {
    this.setState({ addStudentModalVisible: false });
  };

  showAddStudentModal = () => {
    this.setState({ addStudentModalVisible: true });
  };

  render() {
    const { students, isFetching, addStudentModalVisible } = this.state;
    return (
      <Container>
        <WrappedNewStudentModalForm
          onSubmit={this.addNewStudent}
          visible={addStudentModalVisible}
          onCancel={this.cancelAddNewStudent}
        />
        <section>
          <Button
            icon="user-add"
            type="primary"
            onClick={this.showAddStudentModal}
            className={buttonStyles}
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
            style={{
              paddingLeft: '50px',
              width: '600px',
            }}
          />
        </Spin>
      </Container>
    );
  }
}
