/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, Input as AntInput, Spin } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { PaginationConfig } from 'antd/lib/table';
import { UserDTO, UserId } from 'common';
import React from 'react';

import { usersService } from '../../api';
import { ApiResponse2 } from '../../api/authFetch';
import {
  Breadcrumbs,
  ErrorMessage,
  SelectRole,
  theme,
  UsersTable,
} from '../../components';
import { PaddingContainer } from '../../components/PaddingContainer';
import { LABELS } from '../../utils/labels';

import { WrappedNewUserModalForm } from './AddUserForm';

const SearchPanel = styled.div`
  margin: ${theme.Padding.Half} 0 ${theme.Padding.Half} 0;
  display: flex;
  flex-wrap: wrap;
  > * {
    margin-bottom: 5px;
  }
`;

const Input = styled(AntInput)`
  width: 400px;
  margin-right: ${theme.Padding.Quarter};
`;

const selectStyles = css`
  width: 300px;
  margin-right: ${theme.Padding.Quarter};
`;

const buttonStyles = css`
  margin: ${theme.Padding.Half} ${theme.Padding.Half} ${theme.Padding.Half} 0;
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
        limit: 10,
        roles: searchRoles,
        searchParam: searchValue,
      })
      .then(res => {
        if (ApiResponse2.isError(res)) {
          throw res;
        }
        this.setState({
          isLoading: false,
          total: parseInt(res.data.total, 10),
          users: res.data.users,
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

  handleDeleteUser = (id: UserId) => {
    usersService.deleteUser(id).then(() => {
      this.updateUsersList(this.state.currentPage);
    });
  };

  handleSendInvitation = (
    user: Pick<UserDTO, 'email' | 'user_name' | 'user_role'>
  ) => {
    usersService.sendInvitation(user);
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
              onSendInvitation={this.handleSendInvitation}
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
