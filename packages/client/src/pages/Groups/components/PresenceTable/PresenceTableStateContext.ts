import { createContext } from 'react';

import { PresenceAndActivityChangeHandler } from './PresenceAndActivityControls';

type PresenceTableProps = import('./index').PresenceTableProps;

type PresenceTableStateContextValue = {
  onChange: PresenceAndActivityChangeHandler;
  // Add more if needed.
  // Used in AllStudentsPresenceCheckbox
  value: Pick<PresenceTableProps, 'meetingsDetails'>;
};
export const PresenceTableStateContext = createContext<
  PresenceTableStateContextValue
>({
  onChange: () => undefined,
  value: {
    meetingsDetails: [],
  },
});

const {
  Consumer: PresenceTableStateConsumer,
  Provider: PresenceTableStateProvider,
} = PresenceTableStateContext;

export { PresenceTableStateConsumer, PresenceTableStateProvider };
