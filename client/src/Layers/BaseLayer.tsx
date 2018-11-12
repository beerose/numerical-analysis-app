import { Icon, Layout } from 'antd';
import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps } from 'react-router';

import { AuthConsumer } from '../AuthContext';
import { MainMenu } from '../Components/';
import { ErrorMessage } from '../Components/Error';
import { RouterProvider } from '../RouterContext';

const { Content, Header } = Layout;

const StyledContent = styled(Content)`
  background: inherit;
  padding: 0 50px;
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

const Title = styled('p')`
  cursor: pointer;
  color: white;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);

  transition: color 0.3s ease;
  &:hover {
    color: white;
  }
`;

type Props = RouteComponentProps<any>;
export class BaseLayer extends React.Component<Props> {
  routerActions = {
    goBack: () => {
      this.props.history.goBack();
    },
    goToGroup: (id: string) => {
      this.props.history.push(`/groups/${id}`);
    },
    goToGroupsPage: () => {
      this.props.history.push(`/groups/`);
    },
    goToMainPage: () => {
      this.props.history.push('/');
    },
    goToNewGroup: () => {
      this.props.history.push('/groups/new');
    },
    goToUsersList: () => {
      this.props.history.push('/users');
    },
  };
  render() {
    return (
      <AuthConsumer>
        {({ userRole, error, errorMessage, userAuth }) =>
          userAuth && (
            <StyledLayout>
              <StyledHeader>
                <Title onClick={this.routerActions.goToMainPage}>Analiza Numeryczna M</Title>
                <MainMenu userRole={userRole} location={this.props.location} />
              </StyledHeader>
              <StyledContent>
                {error ? (
                  <ErrorMessage message={errorMessage} />
                ) : (
                  <RouterProvider value={{ routerActions: this.routerActions }}>
                    {this.props.children}
                  </RouterProvider>
                )}
              </StyledContent>
            </StyledLayout>
          )
        }
      </AuthConsumer>
    );
  }
}
