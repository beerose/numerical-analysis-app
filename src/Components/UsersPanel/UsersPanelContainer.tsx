import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Button, Input, Select } from 'antd';
import { listUsers } from '../../api/userApi';
import { UserDTO } from '../../api/userApiDTO';
import { UsersTable } from '../EditableUserTable/';

const SearchPanel = styled('div')`
  margin: 20px 0 20px 0;
  display: flex;
`;

const inputStyles = css`
  width: 25vw;
  margin-right: 10px;
`;

const defaultState = {
  currentPage: '1',
  users: [] as UserDTO[],
  searchValue: undefined,
  searchRoles: undefined,
};
type State = typeof defaultState;

export const { Consumer, Provider } = React.createContext(defaultState);

export class UsersPanelContainer extends React.Component<{}, State> {
  state = defaultState;

  componentWillMount() {
    const { searchValue, searchRoles } = this.state;
    listUsers(searchValue, searchRoles).then(({ users }) => this.setState({ users }));
  }

  render() {
    return (
      <>
        <SearchPanel>
          <Input
            placeholder="Szukaj według imienia, nazwiska lub indeksu"
            className={inputStyles}
          />
          <Select
            mode="multiple"
            className={inputStyles}
            placeholder="Szukaj według roli użytkownika"
          >
            <Select.Option key={'admin'}>admin</Select.Option>
            <Select.Option key={'student'}>student</Select.Option>
            <Select.Option key={'pracownik'}>pracownik</Select.Option>
          </Select>
          <Button shape="circle" icon="search" />
        </SearchPanel>
        <UsersTable users={this.state.users} extraColumns={['role', 'index']} />
      </>
    );
  }
}
