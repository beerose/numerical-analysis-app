/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Colors } from '../utils';
import { UserRole } from '../../../../dist/common';
import { PaddingContainer } from '../components';
import { LocaleContext } from '../components/locale';
import { AuthContextState } from '../AuthContext';
import { Flex } from '../components/Flex';
import { Icon } from 'antd';

type TileLinkProps = LinkProps;

const TileLink = (props: TileLinkProps) => (
  <Link
    {...props}
    css={css`
      background: rgba(25, 25, 50, 0.05);
      color: ${Colors.Blackish};

      font-size: 2em;

      text-decoration: none;

      height: 200px;
      width: 300px;

      margin: 1em;
      padding: 1em;

      display: flex;
      align-items: center;
      justify-content: center;

      transition: box-shadow 0.3s ease;

      &:hover,
      &:focus {
        color: ${Colors.Blackish};
        box-shadow: 0 4px 20px rgb(25, 25, 50, 0.2);
      }

      & > * {
        margin-right: 0.5em;
      }
    `}
  />
);

export type HomeProps = Pick<AuthContextState, 'userName' | 'userRole'>;
export const Home: React.FC<HomeProps> = ({
  userName,
  userRole,
}: HomeProps) => {
  return (
    <LocaleContext.Consumer>
      {({ texts }) => (
        <PaddingContainer as="section">
          <h1
            css={css`
              font-size: 2.5em;
              margin: 1em;
            `}
          >
            {texts.hello} {userName}!
          </h1>
          {/* TODO: Powiedz użytkownikowi jaką ma rolę i co może robić w aplikacji? */}
          <Flex flexDirection="row">
            {userRole !== UserRole.student && (
              <TileLink to="/groups">
                <Icon type="team" />
                {texts.groups}
              </TileLink>
            )}
            {userRole === 'admin' && (
              <TileLink to="/users">
                <Icon type="user" />
                {texts.users}
              </TileLink>
            )}
          </Flex>
        </PaddingContainer>
      )}
    </LocaleContext.Consumer>
  );
};
