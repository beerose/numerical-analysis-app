import { css } from '@emotion/core';
import styled from '@emotion/styled';

type FlexProps = {
  flex: number;
};

export const Flex = styled.section(
  (props: FlexProps) => ({
    flex: props.flex,
  }),
  css`
    display: flex;
  `
);
