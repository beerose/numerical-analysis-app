import styled from '@emotion/styled';

import { Colors } from '../utils';

export const ResetButton = styled.button`
  border: none;
  outline: none;
  box-shadow: none;

  cursor: pointer;

  :active {
    color: ${Colors.Primary};
  }
`;
