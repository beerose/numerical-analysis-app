import { Descriptions, Spin, Table } from 'antd';
import { GroupDTO, UserDTO, UserResultsModel, UserWithGroups } from 'common';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { ApiResponse2 } from '../../api/authFetch';
import {
  Flex,
  Heading,
  LocaleContext,
  PaddingContainer,
  StudentTasksTable,
} from '../../components';
import { isNumberOrNumberString, usePromise } from '../../utils';
import { assertDefined } from '../../utils/assertDefined';
import { useAuthStore } from '../../AuthStore';

import { mergedResultsToTableItem } from './sections';
import { GroupApiContext } from './GroupApiContext';

// TODO: Move this functions somewhere else

type StudentGroupGradeSummaryProps = {
  currentGroup: GroupDTO;
  student: UserWithGroups;
};
export const StudentGroupGradeSummary: React.FC<
  StudentGroupGradeSummaryProps
> = ({ currentGroup, student }) => {
  const {
    actions: { getResults },
  } = useContext(GroupApiContext);
  const user = useAuthStore(s => s.user);

  const results = usePromise(
    () =>
      getResults().then(usersResults => {
        if (ApiResponse2.isError(usersResults)) {
          return usersResults;
        }

        return mergedResultsToTableItem(
          student, // TODO: Fetch user with groups here
          usersResults.data[0]
        );
      }),
    'LOADING',
    []
  );

  console.log({ results });

  return <>{JSON.stringify(currentGroup.data!, null, 2)}</>;
  // const columns = makeGradesSectionColumns({
  //   currentGroup,
  //   omittedKeys: ['confirm_grade'],
  // });
  // return (
  //   <Table<UserResultsModel>
  //     sortDirections={sortDirections}
  //     rowKey={(i: UserResultsModel) => i.userId.toString()}
  //     columns={columns}
  //     dataSource={tableData}
  //     pagination={false}
  //     bordered
  //   />
  // );
};

export type StudentGroupDetailsContainerProps = RouteComponentProps<{
  id: string;
}>;

export const StudentGroupDetailsContainer: React.FC<
  StudentGroupDetailsContainerProps
> = ({
  match: {
    params: { id: paramsGroupId },
  },
}) => {
  const {
    currentGroup,
    actions: { getGroup, cleanCurrentGroup, getStudentWithGrade },
  } = useContext(GroupApiContext);
  const { texts } = useContext(LocaleContext);
  const userId = useAuthStore(s => assertDefined(s.user && s.user.id));

  console.assert(paramsGroupId && isNumberOrNumberString(paramsGroupId));

  const groupId = Number(paramsGroupId);

  useEffect(() => {
    if (!currentGroup) {
      getGroup(groupId);
    } else if (currentGroup.id !== groupId) {
      cleanCurrentGroup();
    }
  }, [currentGroup]);

  const studentWithGradeRes = usePromise(
    () => getStudentWithGrade(userId, groupId),
    'LOADING',
    []
  );

  if (!currentGroup || studentWithGradeRes === 'LOADING') {
    return (
      <Flex as={PaddingContainer} center flex={1}>
        <Spin />
      </Flex>
    );
  }

  if (ApiResponse2.isError(studentWithGradeRes)) {
    // TODO: Consider showing the error here.
    throw studentWithGradeRes;
  }

  const { studentWithGroup: student } = studentWithGradeRes.data;

  return (
    <PaddingContainer>
      <Heading>{currentGroup.group_name}</Heading>
      <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label={texts.groupType}>
          {texts[currentGroup.group_type]}
        </Descriptions.Item>
        <Descriptions.Item label={texts.lecturer}>
          {currentGroup.lecturer_name}
        </Descriptions.Item>
        <Descriptions.Item label={texts.semester}>
          {currentGroup.semester}
        </Descriptions.Item>
      </Descriptions>
      <section>
        <Heading>{texts.grades}</Heading>
        <StudentGroupGradeSummary
          currentGroup={currentGroup}
          student={student}
        />
      </section>
      <section>
        <Heading>{texts.tasks}</Heading>
        <StudentTasksTable groupId={Number(paramsGroupId)} />
      </section>
    </PaddingContainer>
  );
};
