import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Flex } from '../../components/Flex';

import {
  NewGroupFormValues,
  WrappedNewGroupForm,
} from './components/NewGroupForm';
import { GroupApiContext, GroupApiContextState } from './GroupApiContext';

export class CreateGroupContainer extends React.Component<RouteComponentProps> {
  static contextType = GroupApiContext;
  context!: GroupApiContextState;

  componentDidMount() {
    this.context.actions.listLecturers();
  }

  handleSubmit = (formValues: NewGroupFormValues) => {
    this.context.actions.createGroup({
      group_type: formValues.group,
      ...formValues,
    });
  };

  handleCancel = () => this.props.history.push('/groups');

  render() {
    const { isLoading, lecturers } = this.context;
    return (
      <Flex center justifyContent="center" alignItems="center" height="80vh">
        <WrappedNewGroupForm
          loading={isLoading}
          lecturers={lecturers || []}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
        />
      </Flex>
    );
  }
}
