import { FunctionKeys } from 'utility-types';

export type ComponentCallbacks<T extends React.Component> = Pick<
  T,
  Exclude<FunctionKeys<T>, keyof React.Component | undefined>
>;
