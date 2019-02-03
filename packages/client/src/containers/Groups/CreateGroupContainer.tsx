import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Flex } from '../../components/Flex';

import {
  NewGroupFormValues,
  WrappedNewGroupForm,
} from './components/NewGroupForm';
import { GroupApiContext } from './GroupApiContext';

export class CreateGroupContainer extends React.Component<RouteComponentProps> {
  static contextType = GroupApiContext;
  context!: React.ContextType<typeof GroupApiContext>;

  componentDidMount() {
    this.context.apiActions.listSuperUsers();
  }

  handleSubmit = (formValues: NewGroupFormValues) => {
    this.context.apiActions.createGroup({
      group_type: formValues.group,
      ...formValues,
    });
  };

  handleCancel = () => this.props.history.push('/groups');

  render() {
    const { isLoading, superUsers } = this.context;
    return (
      <Flex center justifyContent="center" alignItems="center" height="80vh">
        <WrappedNewGroupForm
          loading={isLoading}
          superUsers={superUsers}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
        />
      </Flex>
    );
  }
}
