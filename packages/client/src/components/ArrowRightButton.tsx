/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import VisuallyHidden from '@reach/visually-hidden';
import { Icon } from 'antd';
import React from 'react';

import { ResetButton } from './ResetButton';

type Props = { alt: string } & React.ComponentProps<typeof ResetButton>;

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

export const ArrowRightButton: React.FC<Props> = ({ alt, ...rest }) => (
  <ResetButton
    css={css`
      width: 100%;
      height: 100%;
      background: inherit;
      border: 1px solid transparent;
      &:hover {
        :not(:disabled) {
          animation: ${pointRight} 0.5s infinite;
        }
      }
      &:focus-visible {
        border-color: currentColor;
      }

      :disabled {
        opacity: 0.5;
        cursor: default;
      }
    `}
    {...rest}
  >
    <VisuallyHidden>{alt}</VisuallyHidden>
    <Icon aria-hidden type="right" />
  </ResetButton>
);
