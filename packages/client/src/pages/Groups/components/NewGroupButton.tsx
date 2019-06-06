import { css } from '@emotion/core';
import { Button } from 'antd';
import React from 'react';

import { LABELS } from '../../../utils/labels';
const newGroupButtonStyles = css`
  width: 140px;
  margin: 25px 0 7px 0;
  align-self: start;
`;
export const NewGroupButton = (props: React.ComponentProps<typeof Button>) => (
  <Button
    icon="usergroup-add"
    type="primary"
    css={newGroupButtonStyles}
    {...props}
  >
    {LABELS.newGroup}
  </Button>
);
