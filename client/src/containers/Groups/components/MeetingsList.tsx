import { Button, Form, List, Modal, Spin } from 'antd';
import { css } from 'emotion';
import * as React from 'react';
import styled from 'react-emotion';

import { Theme } from '../../../components/theme';

import { WrappedNewMeetingForm } from './NewMeetingForm';

const Container = styled.section`
  padding: ${Theme.Padding.Standard};
`;

type State = {
  isLoading: boolean;
  addMeetingModalVisible: boolean;
};
export class MeetingsList extends React.Component<{}, State> {
  state = {
    addMeetingModalVisible: false,
    isLoading: false,
  };

  meetings = [
    { name: 'Spotkanie 1', date: '17/12/2018' },
    { name: 'Spotkanie 2', date: '24/12/2018' },
    { name: 'Spotkanie 3', date: '24/12/2018' },
    { name: 'Spotkanie 4', date: '24/12/2018' },
    { name: 'Spotkanie 5', date: '24/12/2018' },
    { name: 'Spotkanie 6', date: '24/12/2018' },
    { name: 'Spotkanie 7', date: '24/12/2018' },
    { name: 'Spotkanie 8', date: '24/12/2018' },
  ];

  handleAddMeetingClick = () => {
    this.setState({ addMeetingModalVisible: true });
  };

  handleAddNewMeeting = (values: { name: string; date: any }) => {
    console.log(values);
  };
  render() {
    return (
      <Container>
        <Button icon="plus" type="primary" onClick={this.handleAddMeetingClick}>
          Nowe spotkanie
        </Button>
        <Modal visible={this.state.addMeetingModalVisible} footer={null}>
          <WrappedNewMeetingForm onSubmit={this.handleAddNewMeeting} />
        </Modal>
        <Spin spinning={this.state.isLoading}>
          {this.meetings && (
            <List
              itemLayout="horizontal"
              dataSource={this.meetings}
              className={css`
                padding: ${Theme.Padding.Standard} 0;
                max-height: '100vh';
              `}
              renderItem={(item: any) => (
                <List.Item actions={[<a>usuń</a>]}>
                  <List.Item.Meta title={item.name} description={item.date} />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Container>
    );
  }
}
