import { Checkbox } from 'antd';
import React from 'react';
import { Assign } from 'utility-types';

export type SummaryCheckboxProps = Assign<
  React.ComponentProps<typeof Checkbox>,
  {
    checked: number;
    max: number;
    indeterminate?: never;
  }
>;
export const SummaryCheckbox: React.FC<SummaryCheckboxProps> = ({
  checked,
  max,
  ...rest
}) => {
  if (checked === 0) {
    return <Checkbox checked={false} {...rest} />;
  }

  if (checked === max) {
    return <Checkbox checked {...rest} />;
  }

  return <Checkbox indeterminate={true} {...rest} />;
};
