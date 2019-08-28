/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Layout, Modal } from 'antd';
import { identity } from 'io-ts';
import React, { Fragment } from 'react';
import { Route, RouteChildrenProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import {
  ErrorBoundary,
  LoginForm,
  MainMenu,
  NewAccount,
  NewPasswordForm,
} from './components';
import { LocaleContextStatefulProvider } from './components/locale';
import { ForgotPasswordForm } from './components/ForgotPasswordForm.tsx';
import { VisibleForRoles } from './components/VisibleForRoles';
import {
  Groups,
  Home,
  ListUsersContainer,
  NotFoundPage,
  UserDetailsPage,
  Welcome,
} from './pages';
import { GroupApiProvider } from './pages/Groups/GroupApiContext';
import { Logout } from './pages/Logout';
import { SettingsContainer } from './pages/Settings';
import { showMessage } from './utils';
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
  const { actions, errorMessage, user } = useAuthStore(identity);

  const handleLoginSuccess = (...args: Parameters<typeof actions.login>) => {
    actions.login(...args).then(res => {
      if (!('error' in res)) {
        history.push('/');
      }
    });
  };

  const handleResetPassword = (newPassword: string, token: string) => {
    actions
      .changePassword(newPassword, {
        Authorization: `Bearer ${token}`,
      })
      .then(res => {
        if (!('error' in res)) {
          showMessage({ message: 'Hasło zostało zmienione' });
          history.push('/login');
        } else {
          showMessage({
            error: `Wystąpił bład, spróbuj ponownie później`,
          });
        }
      });
  };

  return (
    <LocaleContextStatefulProvider>
      <StyledLayout>
        <StyledHeader>
          <Title>{LABELS.appName}</Title>
          <MainMenu userRole={user && user.user_role} location={location} />
        </StyledHeader>
        <ErrorBoundary>
          <GroupApiProvider history={history} location={location}>
            <StyledContent>
              <Switch>
                <Route path="/accounts/new" component={NewAccount} />
                {user ? (
                  <Fragment>
                    <Route exact path="/" component={Home} />
                    <VisibleForRoles admin superUser>
                      <Route
                        exact
                        path="/users"
                        component={ListUsersContainer}
                      />
                    </VisibleForRoles>
                    <Route path="/users/:id" component={UserDetailsPage} />
                    <Route path="/groups" component={Groups} />
                    <Route path="/settings" component={SettingsContainer} />
                    <Route path="/logout" component={Logout} />
                  </Fragment>
                ) : (
                  <Switch>
                    <Route exact path="/" component={Welcome} />
                    <Route path="/forgot-password">
                      <Welcome />
                      <ForgotPasswordForm
                        onSubmit={actions.resetPassword}
                        errorMessage={errorMessage}
                        onExit={() => {
                          actions.resetError();
                          history.push('/');
                        }}
                      />
                    </Route>
                    <Route
                      path="/accounts/reset_password"
                      render={props => {
                        const token = new URLSearchParams(
                          props.location.search
                        ).get('token');
                        return (
                          <Fragment>
                            <Welcome />
                            <Modal visible centered width={400} footer={false}>
                              <NewPasswordForm
                                onSubmit={newPassword =>
                                  handleResetPassword(newPassword, token || '')
                                }
                              />
                            </Modal>
                          </Fragment>
                        );
                      }}
                    />
                    <Route>
                      <Welcome />
                      <LoginForm
                        onExit={() => {
                          actions.resetError();
                          history.push('/');
                        }}
                        onSubmit={handleLoginSuccess}
                        errorMessage={errorMessage}
                      />
                    </Route>
                  </Switch>
                )}
                <NotFoundPage />
              </Switch>
            </StyledContent>
          </GroupApiProvider>
        </ErrorBoundary>
      </StyledLayout>
    </LocaleContextStatefulProvider>
  );
};
