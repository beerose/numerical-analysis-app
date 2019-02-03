/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Spin } from 'antd';
import { GroupDTO, UserDTO, UserRole } from 'common';
import { saveAs } from 'file-saver';
import * as React from 'react';
import { Omit } from 'react-router';

import { groupsService, usersService } from '../../../api';
import { UsersTable } from '../../../components';
import { Theme } from '../../../components/theme';
import { Flex } from '../../../components/Flex';
import { isSafari } from '../../../utils/isSafari';
import { LABELS } from '../../../utils/labels';
import { studentsToCsv } from '../../../utils/studentsToCsv';
import { WrappedNewStudentModalForm } from '../components/AddStudentForm';
import { CsvControls } from '../components/CsvControls';

const addUserButtonStyles = css`
  margin: ${Theme.Padding.Half};
  margin-left: ${Theme.Padding.Standard};
`;

type UploadObject = {
  file: File;
};

type Props = {
  groupId: GroupDTO['id'];
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
    groupsService.listStudentsWithGroup().then(res => {
      this.setState({
        allStudents: res.students.filter(
          s => !s.group_ids.includes(this.props.groupId)
        ),
        isFetching: false,
        students: res.students.filter(s =>
          s.group_ids.includes(this.props.groupId)
        ),
      });
    });
  }

  componentDidMount() {
    this.updateStudentsLists();
  }

  deleteStudent = (userId: UserDTO['id']) => {
    groupsService
      .deleteUserFromGroup(userId, Number(this.props.groupId))
      .then(() => {
        this.updateStudentsLists();
      });
  };

  updateStudent = (user: Omit<UserDTO, 'user_role'>) => {
    usersService
      .updateUser({ ...user, user_role: UserRole.student })
      .then(() => {
        this.updateStudentsLists();
      });
  };

  handleStudentsCsvUpload = (uploadObject: UploadObject) => {
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

  handleStudentsCsvDownload = () => {
    const { groupId } = this.props;
    const { students } = this.state;

    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob([studentsToCsv(students)], { type: mimeType });

    saveAs(blob, `students-of-group-${groupId}.csv`);
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
    const {
      students,
      isFetching,
      addStudentModalVisible,
      allStudents,
    } = this.state;

    return (
      <Flex flexDirection="column">
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
          <CsvControls
            onDownloadClick={this.handleStudentsCsvDownload}
            onUploadClick={this.handleStudentsCsvUpload}
          />
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
      </Flex>
    );
  }
}
