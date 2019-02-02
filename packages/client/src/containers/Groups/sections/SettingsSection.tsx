import styled from '@emotion/styled';
import { GroupDTO } from 'common';
import * as React from 'react';

import { EditGroupForm } from '../components';

const Container = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 80vh;
`;

type Props = {
  groupId: GroupDTO['id'];
};

export class SettingsSection extends React.Component<Props> {
  render() {
    return (
      <Container>
        <EditGroupForm
          loading={false}
          superUsers={[]}
          onSubmit={() => console.log('submit')}
          onCancel={() => console.log('submit')}
        />
      </Container>
    );
  }
}
