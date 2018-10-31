import { Layout } from "antd";
import * as React from "react";
import styled, { css } from "react-emotion";
import { RouteComponentProps } from "react-router";

import { MainMenu } from "../Components/";
import { Consumer } from "../Context";

const { Content, Header } = Layout;

const headerStyles = css`
  display: flex;

  @media (max-device-width: 580px) {
    height: 106px;
    line-height: 106px;
  }
`;

const Title = styled("p")`
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
        {({ userRole, dispatch }) => (
          <Layout className="layout">
            <Header className={headerStyles}>
              <Title>Analiza Numeryczna M</Title>
              <MainMenu userRole={userRole} location={this.props.location} />
            </Header>
            <Content style={{ padding: "0 50px" }}>
              {this.props.children}
            </Content>
          </Layout>
        )}
      </Consumer>
    );
  }
}
