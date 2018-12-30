import styled from '@emotion/styled';
import { Button, List, Spin } from 'antd';
import { css } from 'emotion';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { GroupDTO, Routes } from '../../../../common/api';
import { groupsService } from '../../api';
import { Theme } from '../../components/theme';
import { DeleteWithConfirm } from '../../components/DeleteWithConfirm';
import { LABELS } from '../../utils/labels';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const newGroupButtonStyles = css`
  width: 140px;
  margin: 25px 0 7px 38px;
  align-self: start;
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
    this.updateGroupsList();
  }

  updateGroupsList = () => {
    this.setState({ isLoading: true });
    groupsService.listGroups().then(res => {
      this.setState({ groups: res.groups, isLoading: false });
    });
  };

  handleDeleteGroup = (id: string) => {
    groupsService.deleteGroup(id).then(() => {
      this.updateGroupsList();
    });
  };

  render() {
    return (
      <Container>
        <Button
          icon="usergroup-add"
          type="primary"
          onClick={() => this.props.history.push('/groups/new')}
          className={newGroupButtonStyles}
        >
          {LABELS.newGroup}
        </Button>
        <Spin spinning={this.state.isLoading}>
          <List
            itemLayout="horizontal"
            dataSource={this.state.groups}
            className={css`
              padding: 0 ${Theme.Padding.Standard};
            `}
            renderItem={(item: GroupDTO) => (
              <List.Item
                actions={[
                  <DeleteWithConfirm onConfirm={() => this.handleDeleteGroup(item.id)}>
                    <a>{LABELS.delete}</a>
                  </DeleteWithConfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link to={`${Routes.Groups.Get.replace(':id', item.id)}`}>
                      {item.group_name}
                    </Link>
                  }
                  // TO DO description={`Prowadzący: ${item.lecturer}`}
                />
              </List.Item>
            )}
          />
        </Spin>
      </Container>
    );
  }
}
