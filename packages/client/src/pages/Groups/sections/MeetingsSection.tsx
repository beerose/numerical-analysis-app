// tslint:disable-next-line:no-single-line-block-comment
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { Button, List, Modal, Spin } from 'antd';
import { MeetingDTO } from 'common';
import moment, { Moment } from 'moment';
import * as React from 'react';

import { theme } from '../../../components/theme';
import { DeleteWithConfirmation } from '../../../components/DeleteWithConfirmation';
import { Flex } from '../../../components/Flex';
import { LABELS } from '../../../utils/labels';
import { WrappedEditMeetingForm } from '../components/EditMeetingForm';
import { WrappedNewMeetingForm } from '../components/NewMeetingForm';
import { GroupApiContextState } from '../GroupApiContext';

const Container = styled.section`
  padding: ${theme.Padding.Standard};
`;

type Props = GroupApiContextState & {
  editable: boolean;
};

type State = {
  meetingModalVisible: boolean;
  modalMode?: 'edit' | 'create';
  editingItem?: MeetingDTO;
};
export class MeetingsSection extends React.Component<Props, State> {
  state: State = {
    meetingModalVisible: false,
  };

  componentDidMount() {
    this.props.actions.listMeetings();
  }

  openNewMeetingModal = () => {
    this.setState({ meetingModalVisible: true, modalMode: 'create' });
  };

  hideNewMeetingModal = () => {
    this.setState({ meetingModalVisible: false });
  };

  handleAddNewMeeting = (values: { name: string; date: Moment }) => {
    const { addMeeting, listMeetings } = this.props.actions;
    addMeeting(values).then(listMeetings);
    this.hideNewMeetingModal();
  };

  handleDeleteMeeting = (id: number) => {
    const { deleteMeeting, listMeetings } = this.props.actions;
    deleteMeeting(id).then(listMeetings);
  };

  handleEditClick = (meeting: MeetingDTO) => {
    this.setState({
      editingItem: meeting,
      meetingModalVisible: true,
      modalMode: 'edit',
    });
  };

  handleEditMeeting = (meeting: MeetingDTO) => {
    const { updateMeeting, listMeetings } = this.props.actions;
    updateMeeting(meeting).then(listMeetings);
    this.hideNewMeetingModal();
  };

  getDefaultNewMeetingDate = () => {
    const { meetings } = this.props;
    if (meetings && meetings.length > 0) {
      return new Date(meetings[0].date);
    }
    return undefined;
  };

  render() {
    const { modalMode, editingItem } = this.state;
    const { meetings, isLoading } = this.props;

    return (
      <Container>
        {this.props.editable && (
          <Button icon="plus" type="primary" onClick={this.openNewMeetingModal}>
            Nowe spotkanie
          </Button>
        )}
        <Modal
          centered
          visible={this.state.meetingModalVisible}
          footer={null}
          onCancel={this.hideNewMeetingModal}
        >
          {modalMode === 'edit' && editingItem ? (
            <WrappedEditMeetingForm
              onSubmit={this.handleEditMeeting}
              model={editingItem}
            />
          ) : (
            <WrappedNewMeetingForm
              onSubmit={this.handleAddNewMeeting}
              defaultDate={this.getDefaultNewMeetingDate()}
            />
          )}
        </Modal>
        {meetings && (
          <List
            itemLayout="horizontal"
            dataSource={meetings}
            css={css`
              max-height: 100vh;
              width: 400px;
            `}
            renderItem={(meeting: MeetingDTO) => {
              return (
                <List.Item
                  actions={
                    this.props.editable
                      ? [
                          <a
                            role="edit"
                            onClick={() => this.handleEditClick(meeting)}
                          >
                            {LABELS.edit}
                          </a>,
                          <DeleteWithConfirmation
                            onConfirm={() =>
                              this.handleDeleteMeeting(meeting.id)
                            }
                          >
                            <a>{LABELS.delete}</a>
                          </DeleteWithConfirmation>,
                        ]
                      : []
                  }
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
        <Flex justifyContent="center">
          <Spin spinning={isLoading} />
        </Flex>
      </Container>
    );
  }
}
