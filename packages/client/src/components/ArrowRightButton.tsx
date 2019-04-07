import { css, keyframes } from '@emotion/core';
import VisuallyHidden from '@reach/visually-hidden';
import { Icon } from 'antd';
import React from 'react';

import { ResetButton } from './ResetButton';

const pointRight = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
`;

type Props = { alt: string } & React.ComponentProps<typeof ResetButton>;

export const ArrowRightButton: React.FC<Props> = ({ alt }) => (
  <ResetButton
    css={css`
      width: 100%;
      height: 100%;
      background: inherit;
      border: 1px solid transparent;
      &:hover {
        animation: ${pointRight} 0.5s infinite;
      }
      &:focus-visible {
        border-color: currentColor;
      }
    `}
  >
    <VisuallyHidden>{alt}</VisuallyHidden>
    <Icon aria-hidden type="right" />
  </ResetButton>
);
