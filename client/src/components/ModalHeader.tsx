import * as React from 'react';
import styled from 'react-emotion';

const Header = styled('header')`
  color: rgba(0, 0, 0, 0.4);
  text-align: center;
`;

export const ModalHeader = ({ title }: { title: string }) => <Header>{title}</Header>;
