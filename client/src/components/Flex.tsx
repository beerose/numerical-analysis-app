import { css } from '@emotion/core';
import styled from '@emotion/styled';

type FlexProps = {
  flex?: number;
  direction?: 'column' | 'row';
};

export const Flex = styled.section(
  (props: FlexProps) => ({
    flex: props.flex,
    flexDirection: props.direction,
  }),
  css`
    display: flex;
    width: 100%;
  `
);
