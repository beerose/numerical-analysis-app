import styled from '@emotion/styled';
import { Col, Input, Row } from 'antd';
import { GroupDTO } from 'common';
import * as React from 'react';

import { LABELS } from '../../../utils';
import { GroupContextState } from '../GroupApiContext';

const Container = styled.section`
  margin-left: 40px;
  margin-top: 30px;
  width: 80vh;
  height: 80vh;
  > div {
    padding-bottom: 15px;
  }
`;

type GroupInfoProps = {
  header: string;
  info: string | number;
};
type GroupInfoState = {
  isEditing: boolean;
};
class GroupInfo extends React.Component<GroupInfoProps, GroupInfoState> {
  state = {
    isEditing: false,
  };

  onEditClick = () => {
    this.setState({ isEditing: true });
  };
  render() {
    const { header, info } = this.props;
    const { isEditing } = this.state;
    return (
      <Row gutter={8}>
        <Col span={8}>
          <b>{header}: </b>
        </Col>
        <Col span={8}>{isEditing ? <Input size="small" /> : info}</Col>
        <Col span={8}>
          <a role="link" onClick={this.onEditClick}>
            Edutuj
          </a>
        </Col>
      </Row>
    );
  }
}

type Props = GroupContextState;
type State = {
  group: GroupDTO;
};
export class SettingsSection extends React.Component<Props, State> {
  editProperty = (propertyName: keyof GroupDTO) => (
    newValue: string | number
  ) => {
    const { group } = this.state;
    const newGroup = group;
    newGroup[propertyName] = newValue;
    this.setState({ group: newGroup });
  };

  render() {
    //const { lecturer_name, group_name, class_number } = this.props.currentGroup;
    //console.log(this.props.currentGroup);
    return (
      <Container>
        <GroupInfo header={LABELS.lecturer} info={lecturer_name || ''} />
        <GroupInfo header={LABELS.name} info={group_name} />
        <GroupInfo header={LABELS.classRoomNumber} info={class_number || '-'} />
      </Container>
    );
  }
}
