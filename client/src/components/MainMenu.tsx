/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Menu } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

const mainMenuStyles = css`
  line-height: inherit;
  position: absolute;
  right: 0;
`;

type MenuItem = { key: string; label: string; icon?: string; path: string };

const MENU_ITEMS: Record<string, MenuItem> = {
  groups: {
    icon: 'team',
    key: 'groups',
    label: 'Grupy',
    path: '/groups',
  },
  settings: {
    icon: 'setting',
    key: 'settings',
    label: 'Ustawienia',
    path: 'settings',
  },
  users: {
    icon: 'user',
    key: 'users',
    label: 'Użytkownicy',
    path: '/users',
  },
};

type Props = {
  userRole: string;
  location: {
    pathname: string;
  };
};
export class MainMenu extends React.Component<Props> {
  getMenuItemsForUserRole(userRole: string) {
    switch (userRole) {
      case 'admin':
        return [MENU_ITEMS.groups, MENU_ITEMS.users, MENU_ITEMS.settings];
      case 'superUser':
        return [MENU_ITEMS.groups, MENU_ITEMS.settings];
      case 'student':
        return [MENU_ITEMS.groups, MENU_ITEMS.settings];
      default:
        return [];
    }
  }

  getSelectedItem() {
    return this.props.location.pathname.split('/')[1];
  }

  render() {
    const menuItems = this.getMenuItemsForUserRole(this.props.userRole);

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        css={mainMenuStyles}
        defaultSelectedKeys={[this.getSelectedItem()]}
      >
        {menuItems.map(item => (
          <Menu.Item key={item.key}>
            <Link to={item.path}>
              <Icon type={item.icon} />
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    );
  }
}
