import styled from '@emotion/styled';
import { GroupDTO } from 'common';
import * as React from 'react';

const Container = styled.section`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  height: 80vh;
`;

type Props = {
  group: GroupDTO;
};

export class SettingsSection extends React.Component<Props> {
  render() {
    const { id, lecturer_id } = this.props.group;
    console.log(this.props.group);
    return <Container>Prowadzący: {lecturer_id}</Container>;
  }
}
