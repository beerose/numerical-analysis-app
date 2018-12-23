import styled, { css } from 'react-emotion';

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
