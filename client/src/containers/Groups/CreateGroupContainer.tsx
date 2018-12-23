import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps } from 'react-router';

import { UserDTO } from '../../../../common/api';
import { ROLES } from '../../../../common/roles';
import * as groupsService from '../../api/groupApi';
import { listUsers } from '../../api/userApi';

import { NewGroupFormValues, WrappedNewGroupForm } from './components/NewGroupForm';

const Container = styled.div`
  align-items: center;
  display: flex;
  height: 80vh;
  justify-content: center;
`;

const initialState = {
  superUsers: [] as UserDTO[],
};

export class CreateGroupContainer extends React.Component<RouteComponentProps> {
  state = initialState;
  componentDidMount() {
    listUsers({ roles: ROLES.superUser }).then(res => {
      this.setState({ superUsers: res.users });
    });
  }

  handleSubmit = (formValues: NewGroupFormValues) => {
    const { academic_year, group: group_type, group_name, super_user_id } = formValues;

    groupsService
      .addGroup({
        academic_year,
        group_name,
        group_type,
      })
      .then(res => {
        this.props.history.push(`/groups/${res.group_id}`);
      });

    // TODO: add relation table from super_user_id
    console.log({ super_user_id });
  };

  handleCancel = () => this.props.history.push('/groups');

  render() {
    return (
      <Container>
        <WrappedNewGroupForm
          superUsers={this.state.superUsers}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
        />
      </Container>
    );
  }
}
