import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Layout } from 'antd';
import React from 'react';
import { Route, RouteChildrenProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import { ErrorBoundary, LoginForm, MainMenu, NewAccount } from './components';
import { VisibleForRoles } from './components/VisibleForRoles';
import { Groups, Home, NotFoundPage, Users, Welcome } from './pages';
import { Logout } from './pages/Logout';
import { SettingsContainer } from './pages/Settings';
import { LABELS } from './utils/labels';
import { useAuthStore } from './AuthStore';

const { Content, Header } = Layout;

const StyledContent = styled(Content)`
  background: inherit;

  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

const StyledHeader = styled(Header)`
  display: flex;

  @media (max-device-width: 580px) {
    height: 106px;
    line-height: 106px;
  }
`;

const StyledLayout = styled(Layout)`
  min-height: 100%;
`;

const Title: React.FC = ({ children }) => (
  <Link
    to="/"
    css={css`
      cursor: pointer;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.65);

      transition: color 0.3s ease;
      &:hover {
        color: white;
      }
    `}
  >
    {children}
  </Link>
);

type Props = RouteChildrenProps;
export const Main: React.FC<Props> = ({ history, location }) => {
  const {
    userRole,
    userAuth,
    actions,
    errorMessage,
    userName,
  } = useAuthStore();

  const handleLoginSuccess = (...args: Parameters<typeof actions.login>) => {
    if (location.pathname === '/login') {
      history.push('/');
    }
    actions.login(...args);
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <Title>{LABELS.appName}</Title>
        <MainMenu userRole={userRole} location={location} />
      </StyledHeader>
      <ErrorBoundary>
        <StyledContent>
          <Switch>
            <Route path="/accounts/new" component={NewAccount} />
            {/* Route for /login is not needed, because no other path will match */}
            {userAuth ? (
              <>
                <Route exact path="/" component={Home} />
                <VisibleForRoles admin superUser>
                  <Route path="/users" component={Users} />
                </VisibleForRoles>
                <Route path="/groups" component={Groups} />
                <Route path="/settings" component={SettingsContainer} />
                <Route path="/logout" component={Logout} />
              </>
            ) : (
              <Switch>
                <Route exact path="/" component={Welcome} />
                <Route path="/login">
                  <Welcome />
                  <LoginForm
                    onSubmit={handleLoginSuccess}
                    errorMessage={errorMessage}
                  />
                </Route>
                <Route>
                  <LoginForm
                    onSubmit={handleLoginSuccess}
                    errorMessage={errorMessage}
                  />
                </Route>
              </Switch>
            )}
            <NotFoundPage />
          </Switch>
        </StyledContent>
      </ErrorBoundary>
    </StyledLayout>
  );
};
