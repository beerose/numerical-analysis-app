/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Spin, Tooltip } from 'antd';
import { UserDTO, UserRole, UserWithGroups } from 'common';
import { saveAs } from 'file-saver';
import React, { useCallback, useEffect, useState } from 'react';
import { Omit } from 'react-router';

import { groupsService, usersService } from '../../../api';
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
    listStudentsInGroup,
    deleteStudentFromGroup,
    updateStudentInGroup,
    uploadUsers,
  },
  currentGroup,
  editable,
}) => {
  const [addStudentModalVisible, isModalVisible] = useBoolean(false);
  const [otherStudents, setOtherStudents] = useState<UserDTO[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [myStudents, setMyStudents] = useState<UserWithGroups[]>([]);

  const updateStudentsLists = useCallback(() => {
    if (!currentGroup) {
      return;
    }
    setIsFetching(true);
    Promise.all([
      listStudentsInGroup().then(myGroupStudents => {
        setMyStudents(myGroupStudents);
        return myGroupStudents;
      }),
      usersService
        .listUsers({})
        .then(res => res.users.filter(u => u.user_role === UserRole.Student)),
    ]).then(([ms, os]) => {
      setIsFetching(false);
      const myStudentsIds = new Set(ms.map(s => s.id));
      setOtherStudents(os.filter(s => !myStudentsIds.has(s.id)));
    });
  }, [currentGroup, listStudentsInGroup]);

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
    const blob = new Blob([studentsToCsv(myStudents)], { type: mimeType });

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
        allStudents={otherStudents}
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
          users={myStudents}
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
