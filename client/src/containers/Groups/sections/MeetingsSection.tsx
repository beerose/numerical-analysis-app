import styled from '@emotion/styled';
import { Button, List, Modal, Spin } from 'antd';
import { css } from 'emotion';
import moment, { Moment } from 'moment';
import * as React from 'react';

import { MeetingDTO } from '../../../../../common/api';
import * as groupsService from '../../../api/groupApi';
import { Theme } from '../../../components/theme';
import { DeleteWithConfirm } from '../../../components/DeleteWithConfirm';
import { LABELS } from '../../../utils/labels';
import { WrappedEditMeetingForm } from '../components/EditMeetingForm';
import { WrappedNewMeetingForm } from '../components/NewMeetingForm';

const Container = styled.section`
  padding: ${Theme.Padding.Standard};
`;

type Props = {
  groupId: string;
};

type State = {
  meetings: MeetingDTO[];
  isLoading: boolean;
  meetingModalVisible: boolean;
  modalMode?: 'edit' | 'create';
  editingItem?: MeetingDTO;
};
export class MeetingsSection extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    meetingModalVisible: false,
    meetings: [],
  };

  componentDidMount() {
    this.updateMeetingsList();
  }

  updateMeetingsList = () => {
    this.setState({ isLoading: true });
    groupsService.listMeetings(this.props.groupId).then(res => {
      this.setState({ meetings: res, isLoading: false });
    });
  };

  openNewMeetingModal = () => {
    this.setState({ meetingModalVisible: true, modalMode: 'create' });
  };

  hideNewMeetingModal = () => {
    this.setState({ meetingModalVisible: false });
  };

  handleAddNewMeeting = (values: { name: string; date: Moment }) => {
    groupsService.addMeeting(values, this.props.groupId).then(() => {
      this.updateMeetingsList();
    });
    this.hideNewMeetingModal();
  };

  handleDeleteMeeting = (id: number) => {
    groupsService.deleteMeeting(id).then(() => {
      this.updateMeetingsList();
    });
  };

  handleEditClick = (meeting: MeetingDTO) => {
    this.setState({ modalMode: 'edit', editingItem: meeting, meetingModalVisible: true });
  };

  handleEditMeeting = (meeting: MeetingDTO) => {
    groupsService.updateMeeting(meeting).then(() => {
      this.updateMeetingsList();
    });
  };

  render() {
    const { meetings, modalMode, editingItem } = this.state;

    return (
      <Container>
        <Button icon="plus" type="primary" onClick={this.openNewMeetingModal}>
          Nowe spotkanie
        </Button>
        <Modal
          centered
          visible={this.state.meetingModalVisible}
          footer={null}
          onCancel={this.hideNewMeetingModal}
        >
          {modalMode === 'edit' && editingItem ? (
            <WrappedEditMeetingForm onSubmit={this.handleEditMeeting} model={editingItem} />
          ) : (
            <WrappedNewMeetingForm onSubmit={this.handleAddNewMeeting} />
          )}
        </Modal>
        {meetings && (
          <List
            itemLayout="horizontal"
            dataSource={meetings}
            className={css`
              padding: ${Theme.Padding.Standard} 0;
              max-height: 100vh;
              width: 400px;
            `}
            renderItem={(meeting: MeetingDTO) => {
              return (
                <List.Item
                  actions={[
                    <a onClick={() => this.handleEditClick(meeting)}>{LABELS.edit}</a>,
                    <DeleteWithConfirm onConfirm={() => this.handleDeleteMeeting(meeting.id)}>
                      <a>{LABELS.delete}</a>
                    </DeleteWithConfirm>,
                  ]}
                >
                  <List.Item.Meta title={meeting.meeting_name} />
                  {moment(meeting.date, 'YYYY-MM-DD')
                    .toDate()
                    .toLocaleDateString()}
                </List.Item>
              );
            }}
          />
        )}
        <div
          className={css`
            width: 100%;
          `}
        >
          <Spin spinning={this.state.isLoading} />
        </div>
      </Container>
    );
  }
}
