/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  Descriptions as AntDescriptions,
  Divider,
  Result,
  Spin,
  Table,
} from 'antd';
import { GroupDTO, UserResultsModel, UserWithGroups } from 'common';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { ApiResponse2 } from '../../api/authFetch';
import {
  Breadcrumbs,
  Flex,
  Heading,
  LocaleContext,
  PaddingContainer,
  StudentTasksTable,
} from '../../components';
import { isNumberOrNumberString, usePromise } from '../../utils';
import { assertDefined } from '../../utils/assertDefined';
import { useAuthStore } from '../../AuthStore';

import {
  makeGradesSectionColumns,
  mergedResultsToTableItem,
  sortDirections,
  SuggestedGrade,
} from './sections';
import { GroupApiContext } from './GroupApiContext';

const Descriptions = (props: React.ComponentProps<typeof AntDescriptions>) => (
  <AntDescriptions
    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
    {...props}
  />
);
Descriptions.Item = AntDescriptions.Item;

type StudentGroupGradeSummaryProps = {
  currentGroup: GroupDTO;
  student: UserWithGroups;
};
const StudentGroupGradeSummary: React.FC<StudentGroupGradeSummaryProps> = ({
  currentGroup,
  student,
}) => {
  const {
    actions: { getResults },
  } = useContext(GroupApiContext);
  const { texts } = useContext(LocaleContext);

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

  if (ApiResponse2.isError(results)) {
    return (
      <Result
        status="500"
        title={texts.somethingWentWrong}
        subTitle={texts.couldntGetGradeSummary}
      />
    );
  }

  if (results === 'LOADING') {
    return <Spin />;
  }

  return (
    <Descriptions>
      <Descriptions.Item label={texts.testsAndTasks}>
        <Flex justifyContent="center" flexDirection="row">
          {results.tasksPoints} /
          <b style={{ paddingLeft: 5 }}>{results.maxTasksPoints}</b>
        </Flex>
      </Descriptions.Item>
      <Descriptions.Item label={texts.suggestedGrade}>
        <SuggestedGrade userResults={results} currentGroup={currentGroup} />
      </Descriptions.Item>
      <Descriptions.Item label={texts.finalGrade}>
        {results.finalGrade || '-'}
      </Descriptions.Item>
    </Descriptions>
  );
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
      <Breadcrumbs css={{ paddingBottom: 10 }} />
      <Heading>{currentGroup.group_name}</Heading>
      <Descriptions>
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
      <StudentGroupGradeSummary currentGroup={currentGroup} student={student} />
      <Divider />
      <section>
        <Heading level={2}>{texts.tasks}</Heading>
        <StudentTasksTable groupId={Number(paramsGroupId)} />
      </section>
    </PaddingContainer>
  );
};
