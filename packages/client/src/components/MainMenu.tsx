import { css } from '@emotion/core';
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
};

// tslint:disable:object-literal-sort-keys
const MENU_ITEMS: Partial<Record<MenuItem['key'], MenuItem>> = {
  groups: {
    icon: 'team',
    key: 'groups',
  },
  users: {
    icon: 'user',
    key: 'users',
  },
  settings: {
    icon: 'setting',
    key: 'settings',
  },
  logout: {
    icon: 'logout',
    key: 'logout',
  },
  login: {
    icon: 'login',
    key: 'login',
  },
};

function getMenuItemsForUserRole(userRole: UserRole | undefined): MenuItem[] {
  if (!userRole) {
    return [MENU_ITEMS.login];
  }

  return [
    MENU_ITEMS.groups,
    userRole === UserRole.Admin && MENU_ITEMS.users,
    MENU_ITEMS.settings,
    MENU_ITEMS.logout,
  ].filter(Boolean) as MenuItem[];
}

type Props = {
  userRole?: UserRole;
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
      {menuItemsForRole.map(({ key, icon }) => (
        <Menu.Item key={key}>
          <Link to={'/' + key}>
            <Icon type={icon} />
            {texts[key]}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};
