import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Button, Input, Select, Upload, Modal, message, Spin } from 'antd';
import { listUsers, addUser, updateUser } from '../../api/userApi';
import { UserDTO } from '../../api/userApiDTO';
import { UsersTable } from '../EditableUserTable/';
import { LABELS } from '../../utils/labels';
import { WrappedNewUserForm } from './AddUserForm';
import { userRoleOptions } from '../../utils/utils';

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

const defaultState = {
  currentPage: '1',
  isLoading: false,
  users: [] as UserDTO[],
  searchValue: undefined,
  searchRoles: undefined,
  addUserModalVisible: false,
};
type State = typeof defaultState;

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
    addUser(user).then(res => {
      this.setState({ addUserModalVisible: false });
      if (res.error) {
        message.error(res.error);
        return;
      }
      message.success(res.message);
      this.updateUsersList();
    });
  };

  handleUpdateUser = (user: UserDTO) => {
    updateUser(user).then(res => {
      if (res.error) {
        message.error(res.error);
        return;
      }
      message.success(res.message);
      this.updateUsersList();
    });
  };

  render() {
    return (
      <>
        <SearchPanel>
          <Input placeholder={LABELS.searchUserPlaceholder} className={inputStyles} />
          <Select
            mode="multiple"
            className={inputStyles}
            placeholder={LABELS.searchByRolePlaceholder}
          >
            {userRoleOptions.map(o => (
              <Select.Option key={o}>{o}</Select.Option>
            ))}
          </Select>
          <Button shape="circle" icon="search" />
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
            onUpdate={this.handleUpdateUser}
            users={this.state.users}
            extraColumns={['role', 'index']}
          />
        </Spin>
      </>
    );
  }
}
