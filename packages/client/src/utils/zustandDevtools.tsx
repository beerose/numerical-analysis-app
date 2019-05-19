/**
 * TODO: Turn it into a library
 */
import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';

type ZustandStore = ReturnType<typeof import('zustand').default>[1];

export function mountStoreSinkDevtool(
  storeName: string,
  store: ZustandStore,
  rootElement?: HTMLElement
) {
  type StoreState = ReturnType<ZustandStore['getState']>;

  const externalUpdates = {
    count: 0,
  };

  const ZustandDevtool: React.FC<StoreState> = props => {
    const allUpdatesCount = useRef(externalUpdates.count); // TODO: Simplify these two counters to a boolean

    useEffect(() => {
      allUpdatesCount.current += 1;
      if (allUpdatesCount.current === externalUpdates.count + 1) {
        allUpdatesCount.current -= 1;

        // DevTools update
        store.setState(props);
      }
    });

    return null;
  };

  (ZustandDevtool as any).displayName = `((${storeName})) devtool`;

  if (!rootElement) {
    let root = document.getElementById('zustand-hacky-devtools');
    if (!root) {
      root = document.createElement('div');
      root.id = 'zustand-hacky-devtools';
    }

    document.body.appendChild(root);
    // tslint:disable-next-line:no-parameter-reassignment
    rootElement = root;
  }

  const renderDevtool = (state: StoreState) => {
    render(<ZustandDevtool {...state} />, rootElement!);
    externalUpdates.count += 1;
  };

  renderDevtool(store.getState());
  store.subscribe(renderDevtool);
}
