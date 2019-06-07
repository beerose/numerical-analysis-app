import { Modal as AntModal } from 'antd';
import React from 'react';

import { useBoolean } from '../utils';

// TODO: Consider additional API -- render prop (actions => jsx)

type ModalProps = React.ComponentProps<typeof AntModal> & {
  trigger: (actions: {
    close: () => void;
    open: () => void;
    toggle: () => void;
  }) => JSX.Element;
};
export const Modal: React.FC<ModalProps> = ({ trigger, ...rest }) => {
  const [isModalOpen, actions] = useBoolean(false);

  return (
    <>
      {trigger({
        close: actions.turnOff,
        open: actions.turnOn,
        toggle: actions.toggle,
      })}
      <AntModal onCancel={actions.turnOff} {...rest} visible={isModalOpen} />
    </>
  );
};
