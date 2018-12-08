import { Button, Icon, Input, List, Menu, Spin } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import MenuItem from 'antd/lib/menu/MenuItem';
import SubMenu from 'antd/lib/menu/SubMenu';
import { css } from 'emotion';
import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps } from 'react-router';

import { GroupDTO } from '../../../../common/api';
import { groupsService } from '../../api';

const menuStyles = css`
  width: 200px;
  height: 100vh;
  margin-left: -50px;
`;

type State = {};
export class EditGroupContainer extends React.Component<RouteComponentProps, State> {
  state = {};

  render() {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['students']}
        className={menuStyles}
      >
        <MenuItem key="students">
          <Icon type="team" />
          Studenci
        </MenuItem>
        <Menu.Item key="lists">
          <Icon type="calculator" />
          Listy zadań
        </Menu.Item>
        <Menu.Item key="meetings">
          <Icon type="schedule" />
          Spotkania
        </Menu.Item>
        <Menu.Item key="presence">
          <Icon type="calendar" />
          Obecności
        </Menu.Item>
        <Menu.Item key="activity">
          <Icon type="plus" />
          Aktywności
        </Menu.Item>
        <Menu.Item key="grades">
          <Icon type="line-chart" />
          Oceny
        </Menu.Item>
      </Menu>
    );
  }
}
