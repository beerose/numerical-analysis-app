/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { List, Spin } from 'antd';
import { GroupDTO, UserDTO } from 'common';
import React, { Fragment, useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { Breadcrumbs, ErrorMessage, Theme } from '../../components';
import { LocaleContext } from '../../components/locale';
import { DeleteWithConfirmation } from '../../components/DeleteWithConfirmation';
import { PaddingContainer } from '../../components/PaddingContainer';
import { usePromise } from '../../utils';
import { LABELS } from '../../utils/labels';
import { makeIdDict } from '../../utils/makeDict';

import { NewGroupButton } from './components/NewGroupButton';
import { GroupApiContext } from './GroupApiContext';

type GroupListItemProps = GroupDTO & {
  handleDelete: () => void;
  lecturer: UserDTO;
};
const GroupListItem = (props: GroupListItemProps) => {
  const { texts } = useContext(LocaleContext);

  return (
    <List.Item
      actions={[
        <DeleteWithConfirmation onConfirm={props.handleDelete}>
          <a>{LABELS.delete}</a>
        </DeleteWithConfirmation>,
      ]}
    >
      <List.Item.Meta
        title={<Link to={`/groups/${props.id}`}>{props.group_name}</Link>}
        description={
          props.lecturer && (
            <Fragment>
              <Link
                to={`/users/${props.lecturer_id}`}
                title={texts.lecturer}
                css={css`
                  color: inherit;
                `}
              >
                {props.lecturer.user_name}
              </Link>
              <span
                css={css`
                  margin-left: ${Theme.Padding.Standard};
                `}
              >
                {props.semester}
              </span>
            </Fragment>
          )
        }
      />
    </List.Item>
  );
};

export const ListGroupsContainer: React.FC<RouteComponentProps> = props => {
  const groupApi = useContext(GroupApiContext);

  useEffect(() => {
    groupApi.actions.listGroups();
  }, []);

  const lecturers = usePromise(
    () => groupApi.actions.listLecturers().then(makeIdDict),
    makeIdDict(groupApi.lecturers),
    []
  );

  const {
    groups,
    isLoading,
    error,
    actions: { deleteGroup },
  } = groupApi;

  return (
    <PaddingContainer>
      <Breadcrumbs />
      <NewGroupButton onClick={() => props.history.push('/groups/new')} />
      <Spin spinning={isLoading}>
        {error ? (
          <ErrorMessage message={error.toString()} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={groups}
            renderItem={group => (
              <GroupListItem
                {...group}
                handleDelete={() => deleteGroup(group.id)}
                lecturer={lecturers[group.lecturer_id]}
              />
            )}
          />
        )}
      </Spin>
    </PaddingContainer>
  );
};
