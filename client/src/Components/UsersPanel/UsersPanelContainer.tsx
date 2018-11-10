import { Button, Input, Modal, Spin, Upload } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { PaginationConfig } from 'antd/lib/table';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import * as usersService from '../../api/userApi';
import { LABELS } from '../../utils/labels';
import { UsersTable } from '../EditableUserTable/';
import { SelectRole } from '../SelectRole';

import { WrappedNewUserForm } from './AddUserForm';

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

const defaultState = {
  addUserModalVisible: false,
  currentPage: 1,
  isLoading: false,
  searchRoles: undefined,
  searchValue: undefined,
  total: 50,
  users: [] as UserDTO[],
};

export const { Consumer, Provider } = React.createContext(defaultState);

export class UsersPanelContainer extends React.Component<{}, State> {
  state = defaultState;

  componentWillMount() {
    this.updateUsersList(1);
  }

  updateUsersList = (currentPage: number) => {
    const { searchValue, searchRoles } = this.state;
    this.setState({ isLoading: true });
    usersService
      .listUsers(searchValue, searchRoles, currentPage)
      .then(({ users, total }) =>
        this.setState({ users, isLoading: false, total: parseInt(total, 10) })
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
      this.setState({ addUserModalVisible: false, currentPage: 1 });
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

  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: e.target.value });
  };

  onSearchRoleChange = (value: SelectValue) => {
    this.setState({ searchRoles: value as string[] });
  };

  handleSearchClick = () => {
    this.updateUsersList(1);
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      this.updateUsersList(1);
    }
  };

  handlePaginationChange = (cfg: PaginationConfig) => {
    this.setState({ currentPage: cfg.current || 1 });
    this.updateUsersList(cfg.current || 1);
  };

  render() {
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
          />
          <Button shape="circle" icon="search" onClick={this.handleSearchClick} />
        </SearchPanel>
        <Button
          type="default"
          icon="user-add"
          onClick={this.showAddUserModal}
          className={buttonStyles}
        >
          {LABELS.addNewUser}
        </Button>
        <Modal
          visible={this.state.addUserModalVisible}
          title="Nowy użytkownik"
          onCancel={this.cancelAddUser}
          footer={null}
        >
          <WrappedNewUserForm onSubmit={this.addNewUser} />
        </Modal>
        <Upload accept="text/csv" showUploadList={false}>
          <Button type="default" icon="upload" className={buttonStyles}>
            {LABELS.upload}
          </Button>
        </Upload>
        <Spin spinning={this.state.isLoading}>
          <UsersTable
            currentPage={this.state.currentPage}
            onDelete={this.handleDeleteUser}
            onUpdate={this.handleUpdateUser}
            users={this.state.users}
            total={this.state.total}
            extraColumns={['role', 'index']}
            onTableChange={this.handlePaginationChange}
          />
        </Spin>
      </>
    );
  }
}
