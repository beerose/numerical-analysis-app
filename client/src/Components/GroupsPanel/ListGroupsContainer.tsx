import { Button, List, Spin } from 'antd';
import { css } from 'emotion';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { GroupDTO, UserDTO } from '../../../../common/api';
import { groupsService } from '../../api';

import { UploadUsers } from '.';

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
      <>
        <Button
          icon="usergroup-add"
          type="primary"
          onClick={() => this.props.history.push('/groups/new')}
        >
          Nowa grupa
        </Button>
        <Spin spinning={this.state.isLoading}>
          <List
            itemLayout="horizontal"
            dataSource={this.state.groups}
            className={css`
              max-width: 60%;
            `}
            renderItem={(item: GroupDTO) => (
              <List.Item
                className={css`
                  /* background: white; */
                  padding: 5px 10px;
                  margin: 5px;
                  border-radius: 4px;
                  cursor: pointer;
                  /* border: 1px solid #e8e8e8; */
                `}
              >
                <List.Item.Meta
                  title={<a>{item.group_name}</a>}
                  description={`Prowadzący: ${item.lecturer}`}
                />
              </List.Item>
            )}
          />
        </Spin>
      </>
    );
  }
}
