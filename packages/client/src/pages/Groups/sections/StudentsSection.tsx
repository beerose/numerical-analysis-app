/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Spin, Tooltip } from 'antd';
import { UserDTO, UserWithGroups } from 'common';
import { saveAs } from 'file-saver';
import React, { useCallback, useEffect, useState } from 'react';
import { Omit } from 'react-router';

import { UsersTable } from '../../../components';
import { theme } from '../../../components/theme';
import { Flex } from '../../../components/Flex';
import { useBoolean, useToggle } from '../../../utils';
import { isSafari } from '../../../utils/isSafari';
import { studentsToCsv } from '../../../utils/studentsToCsv';
import { WrappedNewStudentModalForm } from '../components/AddStudentForm';
import { CsvControls } from '../components/CsvControls';
import { GroupApiContextState } from '../GroupApiContext';

const addUserButtonStyles = css`
  margin: ${theme.Padding.Half};
  margin-left: ${theme.Padding.Standard};
`;

type UploadObject = {
  file: File;
};

type Props = GroupApiContextState & {
  editable: boolean;
};

type State = {
  students: UserDTO[];
  isFetching: boolean;
  addStudentModalVisible: boolean;
  allStudents: UserDTO[];
};
export const StudentsSection: React.FC<Props> = ({
  actions: {
    addNewStudentToGroup,
    listStudentsWithGroup,
    deleteStudentFromGroup,
    updateStudentInGroup,
    uploadUsers,
  },
  currentGroup,
  editable,
}) => {
  const [addStudentModalVisible, isModalVisible] = useBoolean(false);
  const [allStudents, setAllStudents] = useState<UserWithGroups[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [students, setStudents] = useState<UserWithGroups[]>([]);

  const updateStudentsLists = useCallback(() => {
    if (!currentGroup) {
      return;
    }
    listStudentsWithGroup().then(res => {
      setAllStudents(res.filter(s => !s.group_ids.includes(currentGroup.id)));
      setIsFetching(false);
      setStudents(res.filter(s => s.group_ids.includes(currentGroup.id)));
    });
  }, [currentGroup, listStudentsWithGroup]);

  useEffect(() => {
    updateStudentsLists();
  }, []);

  const deleteStudent = (userId: UserDTO['id']) => {
    deleteStudentFromGroup(userId);
    updateStudentsLists();
  };

  const updateStudent = (user: Omit<UserDTO, 'user_role'>) => {
    updateStudentInGroup(user);
    updateStudentsLists();
  };

  const handleStudentsCsvUpload = (uploadObject: UploadObject) => {
    const { file } = uploadObject;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      uploadUsers(reader.result as string).then(() => {
        updateStudentsLists();
      });
    };
  };

  const handleStudentsCsvDownload = () => {
    if (!currentGroup) {
      return;
    }

    const mimeType = isSafari() ? 'application/csv' : 'text/csv';
    const blob = new Blob([studentsToCsv(students)], { type: mimeType });

    saveAs(blob, `students-of-group-${currentGroup.id}.csv`);
  };

  const addNewStudent = useCallback(
    (user: UserDTO) => {
      addNewStudentToGroup(user).then(() => {
        isModalVisible.turnOff();
        updateStudentsLists();
      });
    },
    [addNewStudentToGroup]
  );

  return (
    <Flex flexDirection="column">
      <WrappedNewStudentModalForm
        allStudents={allStudents}
        onSubmit={addNewStudent}
        visible={addStudentModalVisible}
        onCancel={isModalVisible.turnOff}
      />
      <section>
        <Tooltip
          title={!editable && 'Nie masz uprawnień aby dodać użytkownika'}
        >
          <Button
            icon="user-add"
            type="primary"
            onClick={isModalVisible.turnOn}
            css={addUserButtonStyles}
            disabled={!editable}
          >
            Dodaj studenta
          </Button>
        </Tooltip>
        <CsvControls
          onDownloadClick={handleStudentsCsvDownload}
          onUploadClick={editable ? handleStudentsCsvUpload : undefined}
        />
      </section>
      <Spin spinning={isFetching}>
        <UsersTable
          showPagination={false}
          onDelete={deleteStudent}
          hideDelete={!editable}
          onUpdate={updateStudent}
          hideEdit={!editable}
          users={students}
          extraColumns={['index']}
          css={{
            paddingBottom: theme.Padding.Half,
            paddingLeft: theme.Padding.Standard,
            width: '600px',
          }}
        />
      </Spin>
    </Flex>
  );
};
