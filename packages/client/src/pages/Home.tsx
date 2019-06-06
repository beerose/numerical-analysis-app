import { css } from '@emotion/core';
import { Icon } from 'antd';
import React, { useContext } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { PaddingContainer } from '../components';
import { LocaleContext } from '../components/locale';
import { Flex } from '../components/Flex';
import { Colors } from '../utils';
import { useAuthStore } from '../AuthStore';

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

const TilesNavigation = () => {
  const { texts } = useContext(LocaleContext);

  return (
    <Flex as="nav" flexDirection="row">
      <TileLink to="/groups">
        <Icon type="team" />
        {texts.groups}
      </TileLink>
      <TileLink to="/users">
        <Icon type="user" />
        {texts.users}
      </TileLink>
    </Flex>
  );
};

export const Home: React.FC = () => {
  const { texts } = useContext(LocaleContext);
  const { userName } = useAuthStore();

  return (
    <PaddingContainer as="section">
      <h1
        css={css`
          font-size: 2.5em;
          margin: 1em;
        `}
      >
        {texts.hello} {userName}!
      </h1>
      <TilesNavigation />
    </PaddingContainer>
  );
};
