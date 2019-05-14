import styled from '@emotion/styled';
import { Icon } from 'antd';

import { Colors } from '../utils';

export const RemoveSelected = styled(Icon)`
  padding: 5px;
  cursor: pointer;
  * {
    fill: ${Colors.Blackish};
  }
`;
