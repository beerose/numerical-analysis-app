import { Menu } from 'antd';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

export type MenuLinkProps = {
  to: LinkProps['to'];
} & React.ComponentProps<typeof Menu.Item>;

export const MenuLink = ({ children, to, ...rest }: MenuLinkProps) => (
  <Menu.Item {...rest}>
    <Link to={to}>{children}</Link>
  </Menu.Item>
);
