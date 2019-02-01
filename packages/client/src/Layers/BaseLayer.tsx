import styled from '@emotion/styled';
import { Layout } from 'antd';
import * as React from 'react';
import { RouteChildrenProps } from 'react-router';

import { ServerRoutes } from 'common';
import { LoginForm, MainMenu } from '../components/';
import { LABELS } from '../utils/labels';
import { AuthConsumer } from '../AuthContext';

import { ErrorBoundary } from './ErrorLayer';

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
    const pathname = this.props.location.pathname;
    return (
      <AuthConsumer>
        {({ userRole, userAuth, actions, errorMessage }) => {
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
                  {userAuth || pathname === ServerRoutes.Accounts.New ? (
                    this.props.children
                  ) : (
                    <LoginForm
                      onSubmit={actions.login}
                      errorMessage={errorMessage}
                    />
                  )}
                </StyledContent>
              </ErrorBoundary>
            </StyledLayout>
          );
        }}
      </AuthConsumer>
    );
  }
}