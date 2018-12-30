import { css } from '@emotion/core';
import styled from '@emotion/styled';

type FlexProps = {
  flex?: number;
  flexDirection?: 'column' | 'row';
};

export const Flex = styled.section(
  (props: FlexProps) => {
    const res: Record<string, any> = {};
    if (props.flex) {
      res.flex = props.flex;
    }
    if (props.flexDirection) {
      res.flexDirection = props.flexDirection;
    }
    return res;
  },
  css`
    display: flex;
    width: 100%;
  `
);
