/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Icon, List, Spin } from 'antd';
import { GroupDTO, UserDTO, UserId } from 'common';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { Breadcrumbs, ErrorMessage, theme } from '../../components';
import { LocaleContext } from '../../components/locale';
import { DeleteWithConfirmation } from '../../components/DeleteWithConfirmation';
import { IfUserPrivileged } from '../../components/IfUserPrivileged';
import { PaddingContainer } from '../../components/PaddingContainer';
import { RemoveSelected } from '../../components/RemoveSelected';
import { ResetButton } from '../../components/ResetButton';
import { usePromise } from '../../utils';
import { LABELS } from '../../utils/labels';
import { makeIdDict } from '../../utils/makeDict';

import { GroupsListItemDescription } from './components/GroupsListItemDescription';
import { NewGroupButton } from './components/NewGroupButton';
import { SelectLecturer } from './components/SelectLecturer';
import { GroupApiContext } from './GroupApiContext';

type GroupListItemProps = GroupDTO & {
  handleDelete: () => void;
  lecturer: UserDTO;
};
const GroupListItem = (props: GroupListItemProps) => {
  return (
    <List.Item
      actions={[
        <IfUserPrivileged
          to={['edit']}
          in="groups"
          withId={props.id}
          render={
            <DeleteWithConfirmation onConfirm={props.handleDelete}>
              <Icon type="delete" css={{ height: 48 }} />
            </DeleteWithConfirmation>
          }
        />,
      ]}
    >
      <List.Item.Meta
        title={<Link to={`/groups/${props.id}`}>{props.group_name}</Link>}
        description={
          props.lecturer && (
            <GroupsListItemDescription
              lecturerId={props.lecturer_id}
              lecturerName={props.lecturer.user_name}
              group={props}
            />
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
    if (!groupApi.lecturers) {
      groupApi.actions.listLecturers();
    }
  }, [groupApi.lecturers]);

  const lecturersDict: Record<number, UserDTO> = usePromise(
    () => groupApi.actions.listLecturers().then(makeIdDict),
    groupApi.lecturers ? makeIdDict(groupApi.lecturers) : {},
    []
  );

  // TODO: Hold this state in URL searchParams
  const [selectedLecturer, selectLecturer] = useState<UserId | undefined>(
    undefined
  );

  const {
    groups,
    isLoading,
    lecturers,
    error,
    actions: { deleteGroup },
  } = groupApi;

  if (!lecturers) {
    return <Spin />;
  }

  const dataSource =
    selectedLecturer && groups
      ? groups.filter(g => g.lecturer_id === selectedLecturer)
      : groups;

  return (
    <PaddingContainer>
      <Breadcrumbs />
      <NewGroupButton onClick={() => props.history.push('/groups/new')} />
      <SelectLecturer
        style={{
          marginLeft: theme.Padding.Quarter,
        }}
        lecturers={lecturers}
        onChange={selectLecturer}
        value={selectedLecturer}
      />
      <ResetButton
        disabled={selectedLecturer === undefined}
        onClick={() => selectLecturer(undefined)}
        css={css`
          background: none;
          :disabled {
            opacity: 0;
          }
          transition: opacity 150ms linear;
        `}
      >
        <RemoveSelected type="close-circle" />
      </ResetButton>
      <Spin spinning={isLoading}>
        {error ? (
          <ErrorMessage
            message={
              'message' in error ? error.toString() : JSON.stringify(error)
            }
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={dataSource}
            renderItem={group => (
              <GroupListItem
                {...group}
                handleDelete={() => deleteGroup(group.id)}
                lecturer={lecturersDict[group.lecturer_id]}
              />
            )}
          />
        )}
      </Spin>
    </PaddingContainer>
  );
};
