/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import {
  PaddingContainer,
  Breadcrumbs,
  Heading,
  StudentTasksTable,
} from '../../components';
import { Divider } from 'antd';
import { RouteComponentProps } from 'react-router';

type StudentTaskDetailsContainerProps = RouteComponentProps;
export const StudentTaskDetailsContainer: React.FC<
  StudentTaskDetailsContainerProps
> = props => {
  console.log(props);

  // TODO: Get Task from route state
  // TODO: Fetch Task if it's not in route state

  return null;

  // return (
  //   <PaddingContainer>
  //     <Breadcrumbs css={{ paddingBottom: 10 }} />
  //     <Heading>{task.group_name}</Heading>
  //     <Divider />
  //     <section>
  //       {JSON.stringify(task)}
  //     </section>
  //   </PaddingContainer>
  // )
};
