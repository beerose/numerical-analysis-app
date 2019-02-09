/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Spin } from 'antd';
import { UserDTO } from 'common';
import { saveAs } from 'file-saver';
import * as React from 'react';
import { Omit } from 'react-router';

import { UsersTable } from '../../../components';
import { Theme } from '../../../components/theme';
import { Flex } from '../../../components/Flex';
import { isSafari } from '../../../utils/isSafari';
import { LABELS } from '../../../utils/labels';
import { studentsToCsv } from '../../../utils/studentsToCsv';
import { WrappedNewStudentModalForm } from '../components/AddStudentForm';
import { CsvControls } from '../components/CsvControls';
import { GroupApiContextState } from '../GroupApiContext';

const addUserButtonStyles = css`
  margin: ${Theme.Padding.Half};
  margin-left: ${Theme.Padding.Standard};
`;

type UploadObject = {
  file: File;
};

type Props = GroupApiContextState;

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
    const {
      actions: { listStudentsWithGroup },
      currentGroup,
    } = this.props;
    if (!currentGroup) {
      return;
    }
    listStudentsWithGroup().then(res => {
      this.setState({
        allStudents: res.filter(s => !s.group_ids.includes(currentGroup.id)),
        isFetching: false,
        students: res.filter(s => s.group_ids.includes(currentGroup.id)),
      });
    });
  }

  componentDidMount() {
    this.updateStudentsLists();
  }

  deleteStudent = (userId: UserDTO['id']) => {
    this.props.actions.deleteStudentFromGroup(userId);
    this.updateStudentsLists();
  };

  updateStudent = (user: Omit<UserDTO, 'user_role'>) => {
    this.props.actions.updateStudentInGroup(user);
    this.updateStudentsLists();
  };

  handleStudentsCsvUpload = (uploadObject: UploadObject) => {
    const { file } = uploadObject;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      this.props.actions.uploadUsers(reader.result as string);
      this.updateStudentsLists();
    };
  };

  handleStudentsCsvDownload = () => {
    const { students } = this.state;
    const { currentGroup } = this.props;
    if (!currentGroup) {
      return;
    }

    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob([studentsToCsv(students)], { type: mimeType });

    saveAs(blob, `students-of-group-${currentGroup.id}.csv`);
  };

  addNewStudent = (user: UserDTO) => {
    this.props.actions.addNewStudentToGroup(user).then(() => {
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
