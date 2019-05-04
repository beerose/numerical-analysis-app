import { SelectProps } from 'antd/lib/select';

export const findStringifiedLowercase: SelectProps['filterOption'] = (
  input,
  { props: { children } }
) =>
  children &&
  children
    .toString()
    .toLowerCase()
    .indexOf(input.toLowerCase()) >= 0;
