/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Icon, Menu } from 'antd';
import { UserRole } from 'common';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { LocaleContext, LocaleEntry } from './locale';

const mainMenuStyles = css`
  line-height: inherit;
  position: absolute;
  right: 0;
`;

type MenuItem = {
  key: LocaleEntry;
  icon: string;
  path: string;
};

// tslint:disable:object-literal-sort-keys
const MENU_ITEMS: Partial<Record<MenuItem['key'], MenuItem>> = {
  groups: {
    icon: 'team',
    key: 'groups',
    path: '/groups',
  },
  users: {
    icon: 'user',
    key: 'users',
    path: '/users',
  },
  settings: {
    icon: 'setting',
    key: 'settings',
    path: '/settings',
  },
  logout: {
    icon: 'logout',
    key: 'logout',
    path: '/logout',
  },
};

function getMenuItemsForUserRole(userRole: string): MenuItem[] {
  return [
    MENU_ITEMS.groups,
    userRole === UserRole.Admin && MENU_ITEMS.users,
    MENU_ITEMS.settings,
    MENU_ITEMS.logout,
  ].filter(Boolean) as MenuItem[];
}

type Props = {
  userRole: string;
  location: {
    pathname: string;
  };
};

export const MainMenu: React.FC<Props> = ({ location, userRole }) => {
  const { texts } = useContext(LocaleContext);
  const menuItemsForRole = getMenuItemsForUserRole(userRole);
  const selectedItem = location.pathname.split('/')[1];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      css={mainMenuStyles}
      selectedKeys={[selectedItem]}
    >
      {menuItemsForRole.map(item => (
        <Menu.Item key={item.key}>
          <Link to={item.path}>
            <Icon type={item.icon} />
            {texts[item.key]}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};
