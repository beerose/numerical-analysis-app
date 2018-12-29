import { Button, List, Modal, Spin } from 'antd';
import { css } from 'emotion';
import { Moment } from 'moment';
import * as React from 'react';
import styled from 'react-emotion';

import { MeetingDTO } from '../../../../../common/api';
import * as groupsService from '../../../api/groupApi';
import { Theme } from '../../../components/theme';
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
  addMeetingModalVisible: boolean;
};
export class MeetingsSection extends React.Component<Props, State> {
  state: State = {
    addMeetingModalVisible: false,
    isLoading: false,
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
    this.setState({ addMeetingModalVisible: true });
  };

  hideNewMeetingModal = () => {
    this.setState({ addMeetingModalVisible: false });
  };

  handleAddNewMeeting = (values: { name: string; date: Moment }) => {
    groupsService.addMeeting(values, this.props.groupId);
    this.hideNewMeetingModal();
    this.updateMeetingsList();
  };

  render() {
    const { meetings } = this.state;

    return (
      <Container>
        <Button icon="plus" type="primary" onClick={this.openNewMeetingModal}>
          Nowe spotkanie
        </Button>
        <Modal
          centered
          visible={this.state.addMeetingModalVisible}
          footer={null}
          onCancel={this.hideNewMeetingModal}
        >
          <WrappedNewMeetingForm onSubmit={this.handleAddNewMeeting} />
        </Modal>
        {meetings && (
          <List
            itemLayout="horizontal"
            dataSource={meetings}
            className={css`
              padding: ${Theme.Padding.Standard} 0;
              max-height: '100vh';
            `}
            renderItem={(meeting: MeetingDTO) => (
              <List.Item actions={[<a href="#">usuń</a>]}>
                <List.Item.Meta title={meeting.meeting_name} description={meeting.date} />
              </List.Item>
            )}
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
