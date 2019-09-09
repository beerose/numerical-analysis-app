/** @jsx jsx */
import { jsx } from '@emotion/core';
import { List, Spin } from 'antd';
import React, { useContext } from 'react';

import { useStudentMeetingsQuery } from '../../../api/graphql';
import {
  Breadcrumbs,
  Flex,
  LocaleContext,
  PaddingContainer,
  Text,
  theme,
} from '../../../components';
import { isNumberOrNumberString } from '../../../utils';
import { useAuthStore } from '../../../AuthStore';

type StudentGroupMeetingsSectionProps = {};
export const StudentGroupMeetingsSection: React.FC<
  StudentGroupMeetingsSectionProps
> = () => {
  const userId = useAuthStore(s => s.user && s.user.id);
  const { texts } = useContext(LocaleContext);

  if (!userId) {
    throw new Error(
      "user id is not defined -- this component shouldn't be rendered"
    );
  }

  const { data, loading, error } = useStudentMeetingsQuery({
    variables: {
      id: String(userId),
    },
  });

  if (loading) {
    return (
      <Flex as={PaddingContainer} center flex={1}>
        <Spin />
      </Flex>
    );
  }
  if (error || !data) {
    throw error || new Error('data missing');
  }
  if (!data.student) {
    throw new Error('student missing');
  }

  const meetings = data.student.allStudentMeetings!;

  return (
    <List css={{ fontSize: '1.2rem' }}>
      {meetings.map(meeting => (
        <List.Item key={meeting.meetingId}>
          <List.Item.Meta
            title={meeting.meetingName}
            css={{ h4: { fontSize: '1.2rem' } }}
          />
          <Text strong css={{ paddingRight: '2em' }}>
            {isNumberOrNumberString(meeting.points)
              ? `${meeting.points} ${texts.pts}`
              : texts.absent}
          </Text>
          <Text>{new Date(meeting.date).toLocaleDateString()}</Text>
        </List.Item>
      ))}
    </List>
  );
};
