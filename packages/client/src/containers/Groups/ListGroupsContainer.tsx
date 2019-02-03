/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, List, Spin } from 'antd';
import { GroupDTO } from 'common';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { groupsService } from '../../api';
import { Breadcrumbs, ErrorMessage } from '../../components';
import { DeleteWithConfirm } from '../../components/DeleteWithConfirm';
import { PaddingContainer } from '../../components/PaddingContainer';
import { LABELS } from '../../utils/labels';

const newGroupButtonStyles = css`
  width: 140px;
  margin: 25px 0 7px 0;
  align-self: start;
`;

type State = {
  error?: Error;
  groups: GroupDTO[];
  isLoading: boolean;
};

export class ListGroupsContainer extends React.Component<
  RouteComponentProps,
  State
> {
  state: State = {
    error: undefined,
    groups: [] as GroupDTO[],
    isLoading: false,
  };

  componentDidMount() {
    this.updateGroupsList();
  }

  updateGroupsList = () => {
    this.setState({ isLoading: true });
    groupsService
      .listGroups()
      .then(res => {
        this.setState({ groups: res.groups, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  };

  handleDeleteGroup = (id: GroupDTO['id']) => {
    groupsService.deleteGroup(id).then(() => {
      this.updateGroupsList();
    });
  };

  render() {
    const { isLoading, error, groups } = this.state;

    return (
      <PaddingContainer>
        <Breadcrumbs />
        <Button
          icon="usergroup-add"
          type="primary"
          onClick={() => this.props.history.push('/groups/new')}
          css={newGroupButtonStyles}
        >
          {LABELS.newGroup}
        </Button>
        <Spin spinning={isLoading}>
          {error ? (
            <ErrorMessage message={error.toString()} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={groups}
              renderItem={(item: GroupDTO) => (
                <List.Item
                  actions={[
                    <DeleteWithConfirm
                      onConfirm={() => this.handleDeleteGroup(item.id)}
                    >
                      <a>{LABELS.delete}</a>
                    </DeleteWithConfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Link to={`/groups/${item.id}`}>{item.group_name}</Link>
                    }
                    // description={`Prowadzący: ${item.lecture}`} TO DO
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </PaddingContainer>
    );
  }
}
