import { Button, Icon, Menu, Spin, Upload } from 'antd';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import { groupsService } from '../../api';
import { UsersTable } from '../EditableUserTable';

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
    const { file } = uploadObject;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      groupsService.uploadUsers(reader.result as string).then(() => {
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

  render() {
    return (
      <Container>
        <Upload accept="text/csv" showUploadList={false} customRequest={this.onUpload}>
          <Button type="default" icon="upload" className={buttonStyles}>
            CSV Upload
          </Button>
        </Upload>
        <Spin spinning={this.state.isFetching}>
          <UsersTable
            pageSize={5}
            showPagination={false}
            onDelete={this.deleteStudent}
            onUpdate={this.updateStudent}
            users={this.state.students}
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
