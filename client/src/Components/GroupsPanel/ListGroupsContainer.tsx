import { Button, Input, List, Spin } from 'antd';
import { css } from 'emotion';
import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps } from 'react-router';

import { GroupDTO } from '../../../../common/api';
import { groupsService } from '../../api';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ActionsPanel = styled.div`
  display: flex;
  padding: 15px 38px;
`;

type State = {
  groups: GroupDTO[];
  isLoading: boolean;
};
export class ListGroupsContainer extends React.Component<RouteComponentProps, State> {
  state = {
    groups: [] as GroupDTO[],
    isLoading: false,
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    groupsService.listGroups().then(res => {
      this.setState({ groups: res.groups, isLoading: false });
    });
  }

  render() {
    console.log(this.state);
    return (
      <Container>
        <ActionsPanel>
          <Input
            placeholder="Szukaj według prowadzącego"
            className={css`
              width: 300px;
              margin-right: 15px;
            `}
          />
          <Button shape="circle" icon="search" />
        </ActionsPanel>
        <Button
          icon="usergroup-add"
          type="primary"
          onClick={() => this.props.history.push('/groups/new')}
          className={css`
            width: 140px;
            margin: 0 0 7px 38px;
            align-self: start;
          `}
        >
          Nowa grupa
        </Button>
        <Spin spinning={this.state.isLoading}>
          <List
            itemLayout="horizontal"
            dataSource={this.state.groups}
            className={css`
              padding: 0 40px;
            `}
            renderItem={(item: GroupDTO) => (
              <List.Item
                className={css`
                  /* background: white; */
                  border-radius: 4px;
                  cursor: pointer;
                  /* border: 1px solid #e8e8e8; */
                `}
                actions={[<a>usuń</a>]}
              >
                <List.Item.Meta
                  title={<a>{item.group_name}</a>}
                  description={`Prowadzący: ${item.lecturer}`}
                />
              </List.Item>
            )}
          />
        </Spin>
      </Container>
    );
  }
}
