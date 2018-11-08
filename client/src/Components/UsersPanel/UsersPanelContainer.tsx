import { Button, Input, Modal, Select, Spin, Upload } from 'antd';
import { SelectValue } from 'antd/lib/select';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import { addUser, deleteUser, listUsers, updateUser } from '../../api/userApi';
import { LABELS } from '../../utils/labels';
import { userRoleOptions } from '../../utils/utils';
import { UsersTable } from '../EditableUserTable/';

import { WrappedNewUserForm } from './AddUserForm';

const SearchPanel = styled('div')`
  margin: 20px 0 20px 0;
  display: flex;
`;

const inputStyles = css`
  width: 25vw;
  margin-right: 10px;
`;

const buttonStyles = css`
  margin: 20px 20px 20px 0;
`;

type State = {
  addUserModalVisible: boolean;
  currentPage: string;
  isLoading: boolean;
  searchRoles: string[] | undefined;
  searchValue: string | undefined;
  users: UserDTO[];
};

const defaultState = {
  addUserModalVisible: false,
  currentPage: '1',
  isLoading: false,
  searchRoles: undefined,
  searchValue: undefined,
  users: [] as UserDTO[],
};

export const { Consumer, Provider } = React.createContext(defaultState);

export class UsersPanelContainer extends React.Component<{}, State> {
  state = defaultState;

  componentWillMount() {
    this.updateUsersList();
  }

  updateUsersList = () => {
    const { searchValue, searchRoles } = this.state;
    this.setState({ isLoading: true });
    listUsers(searchValue, searchRoles).then(({ users }) =>
      this.setState({ users, isLoading: false })
    );
  };

  showAddUserModal = () => {
    this.setState({
      addUserModalVisible: true,
    });
  };

  handleCancelAddUser = () => {
    this.setState({ addUserModalVisible: false });
  };

  handleAddNewUser = (user: UserDTO) => {
    addUser(user).then(() => {
      this.setState({ addUserModalVisible: false });
      this.updateUsersList();
    });
  };

  handleUpdateUser = (user: UserDTO) => {
    updateUser(user).then(() => {
      this.updateUsersList();
    });
  };

  handleDeleteUser = (id: string) => {
    deleteUser(id).then(() => {
      this.updateUsersList();
    });
  };

  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: e.target.value });
  };

  onSearchRoleChange = (value: SelectValue) => {
    this.setState({ searchRoles: value as string[] });
  };

  handleSearchClick = () => {
    this.updateUsersList();
  };

  render() {
    return (
      <>
        <SearchPanel>
          <Input
            placeholder={LABELS.searchUserPlaceholder}
            className={inputStyles}
            onChange={this.onSearchInputChange}
          />
          <Select
            mode="multiple"
            className={inputStyles}
            placeholder={LABELS.searchByRolePlaceholder}
            onChange={this.onSearchRoleChange}
          >
            {userRoleOptions.map(o => (
              <Select.Option key={o}>{o}</Select.Option>
            ))}
          </Select>
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
          onCancel={this.handleCancelAddUser}
          footer={null}
        >
          <WrappedNewUserForm onSubmit={this.handleAddNewUser} />
        </Modal>
        <Upload accept="text/csv" showUploadList={false}>
          <Button type="default" icon="upload" className={buttonStyles}>
            {LABELS.upload}
          </Button>
        </Upload>
        <Spin spinning={this.state.isLoading}>
          <UsersTable
            onDelete={this.handleDeleteUser}
            onUpdate={this.handleUpdateUser}
            users={this.state.users}
            extraColumns={['role', 'index']}
          />
        </Spin>
      </>
    );
  }
}
