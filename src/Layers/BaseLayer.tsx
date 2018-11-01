import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Consumer } from '../Context';
import { ErrorMessage } from '../Components/Error';
import { Layout } from 'antd';
import { MainMenu } from '../Components/';
import { RouteComponentProps } from 'react-router';

const { Content, Header } = Layout;

const headerStyles = css`
  display: flex;

  @media (max-device-width: 580px) {
    height: 106px;
    line-height: 106px;
  }
`;

const layoutStyles = css`
  height: 100%;
`;

const Title = styled('p')`
  color: white;
  font-weight: bold;
`;

type Props = RouteComponentProps<any>;
export class BaseLayer extends React.Component<Props> {
  authUser = true; // hardcoded for now
  render() {
    if (!this.authUser) {
      return false; // there will be loading page
    }

    return (
      <Consumer>
        {({ userRole, error, errorMessage }) => (
          <Layout className={layoutStyles}>
            <Header className={headerStyles}>
              <Title>Analiza Numeryczna M</Title>
              <MainMenu
                userRole={userRole}
                location={this.props.location}
              />
            </Header>
            <Content
              style={{ padding: '0 50px', background: 'inherit' }}
            >
              {error ? (
                <ErrorMessage message={errorMessage} />
              ) : (
                this.props.children
              )}
            </Content>
          </Layout>
        )}
      </Consumer>
    );
  }
}
