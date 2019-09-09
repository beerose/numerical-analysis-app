/** @jsx jsx */
import React from 'react';
import { RouteComponentProps } from 'react-router';

type StudentTaskDetailsSectionProps = RouteComponentProps;
export const StudentTaskDetailsSection: React.FC<
  StudentTaskDetailsSectionProps
> = props => {
  console.log(props);

  // TODO: Get Task from route state
  // TODO: Fetch Task if it's not in route state

  return null;

  // return (
  //     <Heading>{task.group_name}</Heading>
  //     <Divider />
  //     <section>
  //       {JSON.stringify(task)}
  //     </section>
  // )
};
