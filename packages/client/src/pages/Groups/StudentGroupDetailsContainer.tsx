import { Descriptions, Spin } from 'antd';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import {
  Heading,
  LocaleContext,
  PaddingContainer,
  StudentTasksTable,
} from '../../components';
import { isNumberOrNumberString } from '../../utils';

import { GroupApiContext } from './GroupApiContext';

export type StudentGroupDetailsContainerProps = RouteComponentProps<{
  id: string;
}>;

export const StudentGroupDetailsContainer: React.FC<
  StudentGroupDetailsContainerProps
> = ({
  match: {
    params: { id: groupId },
  },
}) => {
  const {
    currentGroup,
    actions: { getGroup },
  } = useContext(GroupApiContext);
  const { texts } = useContext(LocaleContext);

  console.assert(groupId && isNumberOrNumberString(groupId));

  useEffect(() => {
    if (!currentGroup) {
      getGroup(Number(groupId));
    }
  }, [currentGroup]);

  if (!currentGroup) {
    return (
      <PaddingContainer>
        <Spin />
      </PaddingContainer>
    );
  }

  return (
    <PaddingContainer>
      <Heading>{currentGroup.group_name}</Heading>
      <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label={texts.groupType}>
          {currentGroup.group_type}
        </Descriptions.Item>
        <Descriptions.Item label={texts.lecturer}>
          {currentGroup.lecturer_name}
        </Descriptions.Item>
        <Descriptions.Item label={texts.semester}>
          {currentGroup.semester}
        </Descriptions.Item>
      </Descriptions>
      TODO:
      {JSON.stringify(currentGroup.data, null, 2)}
      <section>
        <Heading>{texts.tasks}</Heading>
        <StudentTasksTable groupId={Number(groupId)} />
      </section>
    </PaddingContainer>
  );
};
