import * as React from 'react';

import { Flex } from '../../../components';
import { Theme } from '../../../components/theme';

export const TaskSection = (props: React.Props<{}>) => (
  <Flex alignItems="center" padding={Theme.Padding.Half}>
    {props.children}
  </Flex>
);
