import { Button, Input, Spin } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import { usersService } from '../../api';
import { LABELS } from '../../utils/labels';
import { SelectRole, UsersTable } from '../../components';

import { WrappedNewUserModalForm } from './AddUserForm';

const SearchPanel = styled('div')`
  margin: 20px 0 20px 0;
  display: flex;
`;

const inputStyles = css`
  width: 400px;
  margin-right: 10px;
`;

const selectStyles = css`
  width: 300px;
  margin-right: 10px;
`;

const buttonStyles = css`
  margin: 20px 20px 20px 0;
`;

type State = {
  addUserModalVisible: boolean;
  currentPage: number;
  isLoading: boolean;
  searchRoles: string[] | undefined;
  searchValue: string | undefined;
  total: number;
  users: UserDTO[];
};

export class ListUsersContainer extends React.Component<{}, State> {
  state = {
    addUserModalVisible: false,
    currentPage: 1,
    isLoading: false,
    searchRoles: undefined,
    searchValue: undefined,
    total: 0,
    users: [],
  };

  componentWillMount() {
    this.updateUsersList(1);
  }

  updateUsersList = (currentPage: number) => {
    const { searchValue, searchRoles } = this.state;
    this.setState({ currentPage, isLoading: true });
    usersService
      .listUsers({ currentPage, searchParam: searchValue, roles: searchRoles })
      .then(({ users, total }) =>
        this.setState({ users, total: parseInt(total, 10), isLoading: false })
      );
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

  handleDeleteUser = (id: string) => {
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
    const { addUserModalVisible, users, total, currentPage, isLoading } = this.state;
    return (
      <>
        <SearchPanel onKeyPress={this.handleKeyPress}>
          <Input
            placeholder={LABELS.searchUserPlaceholder}
            className={inputStyles}
            onChange={this.onSearchInputChange}
          />
          <SelectRole
            onChange={this.onSearchRoleChange}
            className={selectStyles}
            placeholder={LABELS.searchByRolePlaceholder}
            mode="multiple"
          />
          <Button shape="circle" icon="search" onClick={() => this.updateUsersList(1)} />
        </SearchPanel>
        <Button icon="user-add" onClick={this.showAddUserModal} className={buttonStyles}>
          {LABELS.addNewUser}
        </Button>
        <WrappedNewUserModalForm
          onSubmit={this.addNewUser}
          visible={addUserModalVisible}
          onCancel={this.cancelAddUser}
        />
        <Spin spinning={isLoading}>
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
        </Spin>
      </>
    );
  }
}
