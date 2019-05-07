/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Input as AntInput, Spin } from 'antd';
// tslint:disable:no-submodule-imports
import { SelectValue } from 'antd/lib/select';
import { PaginationConfig } from 'antd/lib/table';
// tslint:enable:no-submodule-imports
import { UserDTO } from 'common';
import * as React from 'react';

import { usersService } from '../../api';
import {
  Breadcrumbs,
  ErrorMessage,
  SelectRole,
  Theme,
  UsersTable,
} from '../../components';
import { PaddingContainer } from '../../components/PaddingContainer';
import { LABELS } from '../../utils/labels';

import { WrappedNewUserModalForm } from './AddUserForm';

const SearchPanel = styled.div`
  margin: ${Theme.Padding.Half} 0 ${Theme.Padding.Half} 0;
  display: flex;
  flex-wrap: wrap;
  > * {
    margin-bottom: 5px;
  }
`;

const Input = styled(AntInput)`
  width: 400px;
  margin-right: ${Theme.Padding.Quarter};
`;

const selectStyles = css`
  width: 300px;
  margin-right: ${Theme.Padding.Quarter};
`;

const buttonStyles = css`
  margin: ${Theme.Padding.Half} ${Theme.Padding.Half} ${Theme.Padding.Half} 0;
`;

type State = {
  error?: Error;
  addUserModalVisible: boolean;
  currentPage: number;
  isLoading: boolean;
  searchRoles?: string[];
  searchValue?: string;
  total: number;
  users: UserDTO[];
};

export class ListUsersContainer extends React.Component<{}, State> {
  state: State = {
    addUserModalVisible: false,
    currentPage: 1,
    isLoading: false,
    searchRoles: undefined,
    searchValue: undefined,
    total: 0,
    users: [],
  };

  componentDidMount() {
    this.updateUsersList(1);
  }

  updateUsersList = (currentPage: number) => {
    const { searchValue, searchRoles } = this.state;
    this.setState({ currentPage, isLoading: true });

    usersService
      .listUsers({
        currentPage,
        roles: searchRoles,
        searchParam: searchValue,
      })
      .then(({ users, total }) => {
        this.setState({
          users,
          isLoading: false,
          total: parseInt(total, 10),
        });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  };

  showAddUserModal = () => {
    this.setState({
      addUserModalVisible: true,
    });
  };

  cancelAddUser = () => {
    this.setState({ addUserModalVisible: false });
  };

  addNewUser = (user: UserDTO) => {
    usersService.addUser(user).then(() => {
      this.setState({
        addUserModalVisible: false,
        searchRoles: undefined,
        searchValue: undefined,
      });
      this.updateUsersList(1);
    });
  };

  handleUpdateUser = (user: UserDTO) => {
    usersService.updateUser(user).then(() => {
      this.updateUsersList(this.state.currentPage);
    });
  };

  handleDeleteUser = (id: UserDTO['id']) => {
    usersService.deleteUser(id).then(() => {
      this.updateUsersList(this.state.currentPage);
    });
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      this.updateUsersList(1);
    }
  };

  handlePaginationChange = (cfg: PaginationConfig) => {
    this.updateUsersList(cfg.current || 1);
  };

  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: e.target.value });
  };

  onSearchRoleChange = (value: SelectValue) => {
    this.setState({ searchRoles: value as string[] });
  };

  render() {
    const {
      error,
      addUserModalVisible,
      users,
      total,
      currentPage,
      isLoading,
    } = this.state;

    return (
      <PaddingContainer>
        <Breadcrumbs />
        <SearchPanel onKeyPress={this.handleKeyPress}>
          <Input
            placeholder={LABELS.searchUserPlaceholder}
            onChange={this.onSearchInputChange}
          />
          <SelectRole
            onChange={this.onSearchRoleChange}
            css={selectStyles}
            placeholder={LABELS.searchByRolePlaceholder}
            mode="multiple"
          />
          <Button
            shape="circle"
            icon="search"
            onClick={() => this.updateUsersList(1)}
          />
        </SearchPanel>
        <Button
          icon="user-add"
          onClick={this.showAddUserModal}
          css={buttonStyles}
        >
          {LABELS.addNewUser}
        </Button>
        <WrappedNewUserModalForm
          onSubmit={this.addNewUser}
          visible={addUserModalVisible}
          onCancel={this.cancelAddUser}
        />
        <Spin spinning={isLoading}>
          {error ? (
            <ErrorMessage message={error.toString()} />
          ) : (
            <UsersTable
              showPagination
              pageSize={10}
              currentPage={currentPage}
              onDelete={this.handleDeleteUser}
              onUpdate={this.handleUpdateUser}
              users={users}
              total={total}
              extraColumns={['role', 'index']}
              onTableChange={this.handlePaginationChange}
            />
          )}
        </Spin>
      </PaddingContainer>
    );
  }
}
