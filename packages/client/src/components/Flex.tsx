import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { CSSProperties, ReactNode } from 'react';

type FlexProps = CSSProperties & {
  children?: ReactNode;
  theme?: object;
};

export const Flex = styled.section(
  ({ children, theme, ...styles }: FlexProps) => {
    return css((styles || {}) as any);
  },
  css`
    display: flex;
  `
);
