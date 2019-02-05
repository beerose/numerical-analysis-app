import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Col, Input, Row, Select } from 'antd';
import { GroupDTO } from 'common';
import * as React from 'react';

import { LABELS } from '../../../utils';
import { GroupApiContextState } from '../GroupApiContext';

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
  inputType?: 'input' | 'select';
  selectOptions?: ({})[];
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
    const { header, info, inputType } = this.props;
    const { isEditing } = this.state;
    return (
      <Row gutter={8}>
        <Col span={8}>
          <b>{header}: </b>
        </Col>
        <Col span={8}>
          {isEditing ? (
            inputType === 'select' ? (
              <Select />
            ) : (
              <Input size="small" />
            )
          ) : (
            info
          )}
        </Col>
        <Col span={8}>
          <a role="link" onClick={this.onEditClick}>
            Edutuj
          </a>
        </Col>
      </Row>
    );
  }
}

type Props = GroupApiContextState;
export class SettingsSection extends React.Component<Props> {
  componentDidMount() {
    this.props.actions.listSuperUsers();
  }

  editProperty = (propertyName: keyof GroupDTO) => (
    newValue: string | number
  ) => {
    const { currentGroup } = this.context;
    const newGroup = currentGroup;
    newGroup[propertyName] = newValue;
    console.log({ newGroup });
  };

  render() {
    const { currentGroup: group } = this.props;
    if (!group) {
      throw new Error('No group in state');
    }
    console.log(this.props.currentGroup);
    return (
      <Container>
        <GroupInfo
          header={LABELS.lecturer}
          info={group.lecturer_name || ''}
          inputType="select"
        />
        <GroupInfo header={LABELS.groupName} info={group.group_name} />
        <GroupInfo
          header={LABELS.classRoomNumber}
          info={group.class_number || '-'}
        />
      </Container>
    );
  }
}
