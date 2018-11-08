import { WrappedFormUtils } from 'antd/lib/form/Form';
import * as React from 'react';

export const {
  Provider: EditableProvider,
  Consumer: EditableConsumer,
} = React.createContext({} as WrappedFormUtils);
