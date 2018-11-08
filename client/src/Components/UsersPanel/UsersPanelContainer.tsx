import { Button, Input, message, Modal, Select, Spin, Upload } from 'antd';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { UserDTO } from '../../../../common/api';
import { addUser, listUsers, updateUser } from '../../api/userApi';
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

const defaultState = {
  addUserModalVisible: false,
  currentPage: '1',
  isLoading: false,
  searchRoles: undefined,
  searchValue: undefined,
  users: [] as UserDTO[],
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
            onDelete={() => null}
            onUpdate={this.handleUpdateUser}
            users={this.state.users}
            extraColumns={['role', 'index']}
          />
        </Spin>
      </>
    );
  }
}
