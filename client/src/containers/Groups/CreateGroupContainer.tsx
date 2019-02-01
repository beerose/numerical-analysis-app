import styled from '@emotion/styled';
import { UserDTO, UserRole } from 'common';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

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
  loading: false,
  superUsers: [] as UserDTO[],
};

type State = typeof initialState;
export class CreateGroupContainer extends React.Component<RouteComponentProps, State> {
  state = initialState;
  componentDidMount() {
    listUsers({ roles: UserRole.superUser }).then(res => {
      this.setState({ superUsers: res.users });
    });
  }

  handleSubmit = (formValues: NewGroupFormValues) => {
    const { academic_year, group: group_type, group_name, lecturer_id } = formValues;

    this.setState({ loading: true });
    groupsService
      .addGroup({
        academic_year,
        group_name,
        group_type,
        lecturer_id,
      })
      .then(res => {
        this.setState({ loading: false });
        if (!('error' in res)) {
          this.props.history.push(`/groups/${res.group_id}`);
        }
      });
  };

  handleCancel = () => this.props.history.push('/groups');

  render() {
    return (
      <Container>
        <WrappedNewGroupForm
          loading={this.state.loading}
          superUsers={this.state.superUsers}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
        />
      </Container>
    );
  }
}
