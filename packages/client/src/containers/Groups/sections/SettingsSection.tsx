import styled from '@emotion/styled';
import { GroupDTO } from 'common';
import * as React from 'react';

import { LABELS } from '../../../utils';

const Container = styled.section`
  margin-left: 40px;
  margin-top: 30px;
  width: 100%;
  height: 80vh;
  > div {
    padding-bottom: 5px;
  }
`;

const GroupInfo = ({
  header,
  info,
}: {
  header: string;
  info: string | number;
}) => (
  <div>
    <b>{header}: </b>
    {info}
  </div>
);

type Props = {
  group: GroupDTO;
};
export class SettingsSection extends React.Component<Props> {
  render() {
    const { lecturer_name, group_name, class_number } = this.props.group;
    console.log(this.props.group);
    return (
      <Container>
        <GroupInfo header={LABELS.lecturer} info={lecturer_name || ''} />
        <GroupInfo header={LABELS.name} info={group_name} />
        <GroupInfo header={LABELS.classRoomNumber} info={class_number || '-'} />
      </Container>
    );
  }
}
