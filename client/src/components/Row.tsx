import styled from 'react-emotion';

type RowProps = {
  flex: number;
};

export const Row = styled.section`
  ${({ flex }: RowProps) => `flex: ${flex};`};
  display: flex;
  flex-direction: row;
`;
