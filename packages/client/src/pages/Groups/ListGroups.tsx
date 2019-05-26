/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { List, Spin } from 'antd';
import { GroupDTO, UserDTO } from 'common';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { Breadcrumbs, ErrorMessage, Theme } from '../../components';
import { LocaleContext } from '../../components/locale';
import { DeleteWithConfirmation } from '../../components/DeleteWithConfirmation';
import { PaddingContainer } from '../../components/PaddingContainer';
import { RemoveSelected } from '../../components/RemoveSelected';
import { usePromise } from '../../utils';
import { LABELS } from '../../utils/labels';
import { makeIdDict } from '../../utils/makeDict';

import { NewGroupButton } from './components/NewGroupButton';
import { SelectLecturer } from './components/SelectLecturer';
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
    if (!groupApi.lecturers) {
      groupApi.actions.listLecturers();
    }
  }, [groupApi.lecturers]);

  const lecturersDict = usePromise(
    () => groupApi.actions.listLecturers().then(makeIdDict),
    groupApi.lecturers ? makeIdDict(groupApi.lecturers) : {},
    []
  );

  // TODO: Add a way to clear selected lecturer
  // TODO: Hold this state in URL searchParams
  const [selectedLecturer, selectLecturer] = useState();

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
        style={{ marginLeft: Theme.Padding.Quarter }}
        lecturers={lecturers}
        onChange={selectLecturer}
        value={selectedLecturer}
      />
      <RemoveSelected
        type="close-circle"
        onClick={() => selectLecturer(null)}
      />
      <Spin spinning={isLoading}>
        {error ? (
          <ErrorMessage message={error.toString()} />
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
