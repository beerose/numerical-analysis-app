import { Button } from 'antd';
import { LocationDescriptorObject } from 'history';
import React, { useCallback } from 'react';
import { Omit } from 'utility-types';

import useRouter from '../utils/useRouter';

export type LinkButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'onClick'
> & {
  to: string | LocationDescriptorObject;
};

export const LinkButton: React.FC<LinkButtonProps> = ({ to, ...rest }) => {
  const { history } = useRouter();

  const handleClick = useCallback(() => {
    // This cast looks redundant, but the overload doesn't click
    history.push(to as LocationDescriptorObject);
  }, []);

  return <Button {...rest} onClick={handleClick} />;
};

