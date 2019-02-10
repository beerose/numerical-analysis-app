/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, List, Modal, Spin } from 'antd';
import * as React from 'react';

import { TaskDTO, TaskKind } from '../../../../../../dist/common';
import { Theme } from '../../../components/theme';
import { DeleteWithConfirm } from '../../../components/DeleteWithConfirm';
import { Flex } from '../../../components/Flex';
import { LABELS } from '../../../utils';
import { GroupApiContextState } from '../GroupApiContext';

const Container = styled.section`
  padding: ${Theme.Padding.Standard};
`;

const TaskTitle = ({ kind, name }: Pick<TaskDTO, 'kind' | 'name'>) => (
  <span>
    <b>{kind === TaskKind.Assignment ? 'Pracownia' : 'Zadanie domowe'}</b>:{' '}
    {name}
  </span>
);

const DateRange = ({ start, end }: { start: string; end: string }) => {
  const startDate = new Date(Date.parse(start)).toLocaleString();
  const endDate = new Date(Date.parse(end)).toLocaleString();
  return (
    <span>
      <b>Oddawanie zadania: </b>
      {startDate} - {endDate}
    </span>
  );
};

type Props = GroupApiContextState;
export const TasksSection = (props: Props) => {
  const { tasks } = props;
  return (
    <Container>
      <Button icon="plus" type="primary">
        Nowe zadanie
      </Button>
      <Modal
        centered
        //visible=
        footer={null}
        //onCancel=
      >
        {/* {modalMode === 'edit' && editingItem ? (
          <WrappedEditMeetingForm
            onSubmit={this.handleEditMeeting}
            model={editingItem}
          />
        ) : (
          <WrappedNewMeetingForm onSubmit={this.handleAddNewMeeting} />
        )} */}
      </Modal>
      {tasks && (
        <List
          itemLayout="horizontal"
          dataSource={tasks}
          css={css`
            padding: ${Theme.Padding.Standard} 0;
            max-height: 100vh;
          `}
          renderItem={(task: TaskDTO) => {
            return (
              <List.Item
                actions={[
                  <DeleteWithConfirm onConfirm={() => null}>
                    <a>{LABELS.delete}</a>
                  </DeleteWithConfirm>,
                ]}
              >
                <List.Item.Meta
                  title={<TaskTitle kind={task.kind} name={task.name} />}
                  description={task.description}
                />
                <DateRange
                  start={task.start_upload_date}
                  end={task.end_upload_date}
                />
              </List.Item>
            );
          }}
        />
      )}
      <Flex justifyContent="center">
        <Spin spinning={false} />
      </Flex>
    </Container>
  );
};
