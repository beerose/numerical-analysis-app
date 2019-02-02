import styled from '@emotion/styled';
import { Layout } from 'antd';
import * as React from 'react';
import { Route, RouteChildrenProps, Switch } from 'react-router';

import {
  ErrorBoundary,
  LoginForm,
  MainMenu,
  NewAccount,
  NotFoundPage,
} from '../components';
import { Groups, Home, ListUsersContainer } from '../containers';
import { LABELS } from '../utils/labels';
import { AuthConsumer } from '../AuthContext';

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

const Title = styled.p`
  cursor: pointer;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);

  transition: color 0.3s ease;
  &:hover {
    color: white;
  }
`;

type Props = RouteChildrenProps;
export class BaseLayer extends React.Component<Props> {
  render() {
    return (
      <AuthConsumer>
        {({ userRole, userAuth, actions, errorMessage, userName }) => {
          return (
            <StyledLayout>
              <StyledHeader>
                <Title onClick={() => this.props.history.push('/')}>
                  {LABELS.appName}
                </Title>
                <MainMenu
                  userRole={userRole || ''}
                  location={this.props.location}
                />
              </StyledHeader>
              <ErrorBoundary>
                <StyledContent>
                  <Switch>
                    <Route
                      path="/accounts/new"
                      render={routeContext => <NewAccount {...routeContext} />}
                    />
                    {userAuth ? (
                      <>
                        <Route
                          exact
                          path="/"
                          render={() => (
                            <Home userRole={userRole} userName={userName} />
                          )}
                        />
                        <Route
                          exact
                          path="/users"
                          component={ListUsersContainer}
                        />
                        <Route path="/groups" render={Groups} />
                      </>
                    ) : (
                      <LoginForm
                        onSubmit={actions.login}
                        errorMessage={errorMessage}
                      />
                    )}
                    <NotFoundPage />
                  </Switch>
                </StyledContent>
              </ErrorBoundary>
            </StyledLayout>
          );
        }}
      </AuthConsumer>
    );
  }
}
