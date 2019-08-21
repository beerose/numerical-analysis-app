/** @jsx jsx */
import React from 'react';
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
